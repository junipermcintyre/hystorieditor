import React from 'react';

class HystoriForm extends React.Component {

  /* Constructor */
  // constructor will always process/set properties or states for the component
  constructor(props) {              // The only expected props are the HystoriData
    super(props);                   // Some React thing idk idc
    this.spec = this.props.spec;    // Set the properties for Hystori
    this.prefix = this.props.prefix;// CSS prefix
    // Build a state object. We're interested
    var ss = {};
    for (var i = 0; i < this.spec.length; i++)
      ss[this.spec[i].key] = this.spec[i].value || "";

    this.state = {
      fields: ss
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(nextProps){
      if(nextProps.prefix !== this.prefix){
        var ss = {};
        for (var i = 0; i < nextProps.spec.length; i++)
          ss[nextProps.spec[i].key] = nextProps.spec[i].value || "";

        this.spec = nextProps.spec;
        this.prefix = nextProps.prefix;
        this.setState({
          fields: ss
        });
      }
  }


  handleChange(evt) {
    var ff = JSON.parse(JSON.stringify(this.state.fields));
    ff[evt.target.name] = evt.target.value;
    this.setState({
      fields: ff
    });
  }

  render() {
    // Input calcuclation


    // Translate the spec to a form
    var formJSX = [];
    for (var i = 0; i < this.spec.length; i++) {
      var inputJSX = null;
      if (this.spec[i].type === "string") {
        inputJSX = <input type="string" onChange={this.handleChange} 
                    value={this.state.fields[this.spec[i].key]} placeholder={this.spec[i].placeholder} 
                    name={this.spec[i].key} 
                    className={this.spec[i].prefix+"__input newEntry__input newEntry__string"} />;
      } else if (this.spec[i].type === "password") {
        inputJSX = <input type="password" onChange={this.handleChange} 
                    value={this.state.fields[this.spec[i].key]} placeholder={this.spec[i].placeholder} 
                    name={this.spec[i].key} 
                    className={this.spec[i].prefix+"__input newEntry__input newEntry__pass"} />;
      } else if (this.spec[i].type === "date") {
        inputJSX = <input type="date" onChange={this.handleChange} 
                    value={this.state.fields[this.spec[i].key]} placeholder={this.spec[i].placeholder} 
                    name={this.spec[i].key} 
                    className={this.spec[i].prefix+"__input newEntry__input newEntry__date"} />;
      } else if (this.spec[i].type === "text") {
        inputJSX = <textarea onChange={this.handleChange} 
                    value={this.state.fields[this.spec[i].key]} placeholder={this.spec[i].placeholder} 
                    name={this.spec[i].key} rows="7" 
                    className={this.spec[i].prefix+"__input newEntry__input newEntry__text"} />;
      } else if (this.spec[i].type === "number") {
        inputJSX = <input type="number" onChange={this.handleChange} 
                    value={this.state.fields[this.spec[i].key]} placeholder={this.spec[i].placeholder} 
                    name={this.spec[i].key} 
                    className={this.spec[i].prefix+"__input newEntry__input newEntry__text"} />;
      }

      formJSX.push(
        <div key={i} className={this.spec[i].prefex+"__row newEntry__row"}>
          <span className={this.spec[i].prefix+"__label newEntry__label"}>{this.spec[i].label}</span> 
          {inputJSX}
        </div>)
      ;
    }

    return (
      <div className={"form form__"+this.prefix}>
        {formJSX}
        <div className="newEntry__row">
          <button onClick={() => this.props.submit(this.spec, this.state.fields)} className="button newEntry__submit"><i className="far fa-plus-square"></i> Add</button>
        </div>
      </div>
    );
  }
}

export default HystoriForm;
