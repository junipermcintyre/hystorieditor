import React from 'react';
import HystoriForm from './HystoriForm.jsx';
import './HystoriEditor.css';

class HystoriEditor extends React.Component {

  /* Constructor */
  // constructor will always process/set properties or states for the component
  constructor(props) {              // The only expected props are the HystoriData
    super(props);                   // Some React thing idk idc
    this.data = this.props.data;    // Set the properties for Hystori
    this.spec = this.props.spec;
    this.events = this.props.data.events;
    this.organizations = this.props.data.organizations;
    this.people = this.props.data.people;
    
    this.state = {          // Set the states (not constant, should trigger re-render)
      events: JSON.parse(JSON.stringify(this.events)),
      organizations: JSON.parse(JSON.stringify(this.organizations)),
      people: JSON.parse(JSON.stringify(this.people)),
      entity: null,
      viewer: false,
      linkerKey: null,
      linkerName: null,
      externalUrl: null,
      externalLabel: null
    };
    
    this.openNewEntity = this.openNewEntity.bind(this)
    this.editEntity = this.editEntity.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.saveEditor = this.saveEditor.bind(this);
    this.openViewer = this.openViewer.bind(this);
    this.closeViewer = this.closeViewer.bind(this);
    this.handleLinkerKeyChange = this.handleLinkerKeyChange.bind(this);
    this.handleLinkerNameChange = this.handleLinkerNameChange.bind(this);
    this.handleExternalUrlChange = this.handleExternalUrlChange.bind(this);
    this.handleExternalLabelChange = this.handleExternalLabelChange.bind(this);
  }

  openNewEntity(t) {  // t = type
    var fillSpec = JSON.parse(JSON.stringify(this.spec[t]));

    this.setState({
      entity: {spec: fillSpec, type: t}
    });
  }

  openViewer() {
    this.setState({viewer: true});
  }

  editEntity(e, t) {  // e is entity, t is type
    var fillSpec = JSON.parse(JSON.stringify(this.spec[t]));
    for (var i = 0; i < fillSpec.length; i++) {
      if (fillSpec[i].key === "name")
        fillSpec[i].value = e.name;
      else if (fillSpec[i].key === "key")
        fillSpec[i].value = e.key;
      else if (fillSpec[i].key === "desc")
        fillSpec[i].value = e.description;
      else if (fillSpec[i].key === "date")
        fillSpec[i].value = e.date;
    }

    this.setState({
      entity: {spec: fillSpec, type: t}
    })
  }

  closeEditor() {
    this.setState({
      entity: null
    });
  }

  closeViewer() {
    this.setState({
      viewer: false
    });
  }

  saveEditor(aSpec, anEntity) {
    // Check if key exists anywhere, update
    var foundIt = false;
    var evs = JSON.parse(JSON.stringify(this.state[this.state.entity.type]));

    for (var i = 0; i < evs.length; i++) {      // For the current type (event/org/person)
      if (evs[i].key === anEntity.key) {        // Loop over events/orgs/people, look for matching key
        foundIt = true;
        evs[i].name = anEntity.name;            // Steal its identity
        evs[i].description = anEntity.desc;
        if (this.state.entity.type === "events")    // If its events also add the data before saving
          evs[i].date = anEntity.date;
      }
    }



    // or add if not in correct type
    // BTW 'evs' is type neutral !
    if (!foundIt) {
      if (this.state.entity.type === "events") {
        evs.push({
          name: anEntity.name,
          key: anEntity.key,
          description: anEntity.desc,
          date: anEntity.date,
          time: null
        });
      } else {
        evs.push({
          name: anEntity.name,
          key: anEntity.key,
          description: anEntity.desc
        });  
      }
    }

    // Finish up
    var stateName = {};
    stateName[this.state.entity.type] = JSON.parse(JSON.stringify(evs));
    this.setState(stateName);
    evs = null;
    this.closeEditor();
    // Also notify or somethin of the save
  }

  handleLinkerKeyChange(evt) {
    this.setState({
      linkerKey: evt.target.value
    });
  }

  handleLinkerNameChange(evt) {
    this.setState({
      linkerName: evt.target.value
    });
  }

  handleExternalUrlChange(evt) {
    this.setState({
      externalUrl: evt.target.value
    });
  }
  
  handleExternalLabelChange(evt) {
    this.setState({
      externalLabel: evt.target.value
    });
  }

  render() {

    var eventJSX = this.state.events.map(event =>
      <li key={event.key} className="events__item events__item--closed item" onClick={() => this.editEntity(event, "events")}>
        {event.name} <small>({event.key}) ({event.date})</small>
      </li>
    );

    var peopleJSX = this.state.people.map(people =>
      <li key={people.key} className="people__item people__item--closed item" onClick={() => this.editEntity(people, "people")}>
        {people.name} <small>({people.key})</small>
      </li>
    );

    var orgJSX = this.state.organizations.map(org =>
      <li key={org.key} className="org__item org__item--closed item" onClick={() => this.editEntity(org, "organizations")}>
        {org.name} <small>({org.key})</small>
      </li>
    );


    // Add Hystori Form
    var editor = null;
    var activeClass = "closed";
    if (this.state.entity !== null) {
      editor = (
        <div className="editor__ux">
          <h2>Add new {this.state.entity.type}</h2>
          <HystoriForm spec={this.state.entity.spec} prefix={this.state.entity.type} submit={this.saveEditor}/>
        </div>
      );

      activeClass = "editing";
    }

    // Add Hystori Viewer
    var viewer = null;
    var viewerAC = "closed";
    if (this.state.viewer) {
      var jsonString = JSON.stringify({
        events: this.state.events,
        people: this.state.people,
        organizations: this.state.organizations
      }, null, 2);
      viewer = (
        <div className="viewer__ux">
          <h2>JSON export</h2>
          <pre className="viewer__json">
            <code className="viewer__code">
              {jsonString}
            </code>
          </pre>
        </div>
      );

      viewerAC = "viewing";
    }

    return (
      <React.Fragment>
        <div className={"viewer editor editor__viewer editor__viewer--"+viewerAC}>
          <span className="closeBtn viewer__close" onClick={this.closeViewer}><i className="far fa-window-close"></i></span>
          {viewer}
          <div className={"editor viewer__tab viewer__tab--"+viewerAC} onClick={this.openViewer}>
            <span className={"viewer__export viewer__export--"+viewerAC}><i className="fas fa-download"></i> Export</span>
          </div>
        </div>

        <div className={"editor editor__mainframe mainframe editor__mainframe--"+activeClass+" editor__mainframe--"+viewerAC}>
          <h1>Hystori Editor</h1>
          <p>This tool is used to edit the JSON object that feeds a Hystori installation.</p>

          <div className="mainframe__entities entities">

            <div className="entities__events">
              <h2>Events</h2>
              <ul className="editor__events events">
                {eventJSX}
              </ul>
              <button className="button" onClick={() => this.openNewEntity("events")}><i className="far fa-plus-square"></i> Add event</button>
            </div>

            <div className="entities__events">
              <h2>People</h2>
              <ul className="editor__people people">
                {peopleJSX}
              </ul>
              <button className="button" onClick={() => this.openNewEntity("people")}><i className="far fa-plus-square"></i> Add person</button>
            </div>

            <div className="entities__events">
              <h2>Organizations</h2>
              <ul className="editor__org org">
                {orgJSX}
              </ul>
              <button className="button" onClick={() => this.openNewEntity("organizations")}> <i className="far fa-plus-square"></i> Add org</button>
            </div>

          </div>
        </div>
        <div className={"aside editor editor__aside editor__aside--"+activeClass}>
          <span className="closeBtn aside__close" onClick={this.closeEditor}><i className="far fa-window-close"></i></span>
          {editor}
          <div className="editor__linker linker">
            <h3>Hystori Linker</h3>
            Key: <input onChange={this.handleLinkerKeyChange}  className="linker__input linker__key" name="linkerKey" type="string" value={this.state.linkerKey || ""} placeholder="rosa.luxemburg" />
            Name: <input onChange={this.handleLinkerNameChange}  className="linker__input linker__name" name="linkerName" type="string" value={this.state.linkerName || ""} placeholder="Rosa Luxemburg" />
            <div className="linker__display">
              &lt;span type=&apos;link&apos; key=&apos;{this.state.linkerKey}&apos;&gt;{this.state.linkerName}&lt;/span&gt;
            </div>
            <p className="linker__info">Use this tool to add Hystori cross-reference. Key specifies the entity, and the label is what gets rendered.</p>

            <h3>External Linker</h3>
            URL: <input onChange={this.handleExternalUrlChange} className="linker__input external_url" name="externalUrl" type="string" value={this.state.externalUrl || ""} placeholder="https://wiki.pedia/" />
            Label: <input onChange={this.handleExternalLabelChange} className="linker__input external_label" name="externalLabel" type="string" value={this.state.externalLabel || ""} placeholder="Article on Wikipedia" />
            <div className="linker__display">
              &lt;a href=&apos;{this.state.externalUrl}&apos; target=&apos;blank&apos;&gt;{this.state.externalLabel}&lt;/a&gt;
            </div>
            <p className="linker__info">Use this tool to add a regular old hyperlink. You probably knew this, but it's speedy</p>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default HystoriEditor;
