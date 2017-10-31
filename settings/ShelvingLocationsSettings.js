import React from 'react';
import PropTypes from 'prop-types';
import ControlledVocab from '@folio/stripes-smart-components/lib/ControlledVocab';

class ShelvingLocationsSettings extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    return (
      <this.connectedControlledVocab
        {...this.props}
        baseUrl="shelf-locations"
        records="shelflocations"
        label="Shelving Locations"
        visibleFields={['name']}
        itemTemplate={{ name: 'string', id: 'string' }}
        nameKey="shelvingLocation"
      />
    );
  }
}

export default ShelvingLocationsSettings;