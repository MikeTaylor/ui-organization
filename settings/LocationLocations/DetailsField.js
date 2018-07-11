import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@folio/stripes-components/lib/TextField';
import RepeatableField from '@folio/stripes-components/lib/RepeatableField';

class DetailsField extends React.Component {
  static manifest = {
    searchTerm: '',
    locations: {
      type: 'okapi',
      path: 'locations?query=(details=%{searchTerm.searchTerm}*)',
    },
  };

  static propTypes = {
    searchTerm: PropTypes.string,
    translate: PropTypes.func,
    resources: PropTypes.shape({
      locations: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      searchTerm: PropTypes.shape({
        replace: PropTypes.func,
      }),
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.getSuggestedTerms = this.getSuggestedTerms.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  getSuggestedTerms(locationsArray) {
    const terms = [];
    for (const item of locationsArray) {
      Object.keys(item.details).forEach(name => {
        if (!terms.includes(name)) terms.push(name);
      });
    }
    return terms;
  }

  handleChange(e) {
    this.props.mutator.searchTerm.replace({ searchTerm: e.target.value });
  }

  render() {
    const { locations } = this.props.resources;
    const locationsArray = locations.records[0] ? locations.records[0].locations : [];
    // eslint-disable-next-line no-unused-vars
    const suggestedTerms = this.getSuggestedTerms(locationsArray);
    return (
      <RepeatableField
        name="detailsArray"
        addLabel={this.props.translate('locations.addDetails')}
        addButtonId="clickable-add-location-details"
        template={[
          {
            name: 'name',
            label: this.props.translate('locations.detailsName'),
            component: TextField,
            onChange: this.handleChange,
            required: true,
          },
          {
            name: 'value',
            label: this.props.translate('locations.detailsValue'),
            component: TextField,
            required: true,
          },
        ]}
        newItemTemplate={{ name: '', value: '' }}
      />
    );
  }
}


export default DetailsField;
