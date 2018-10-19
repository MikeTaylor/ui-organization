import { cloneDeep } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, ExpandAllButton, KeyValue, Row } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import LocationList from './LocationList';

class ServicePointDetail extends React.Component {
  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
      intl: PropTypes.object.isRequired,
    }).isRequired,
    initialValues: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.handleSectionToggle = this.handleSectionToggle.bind(this);
    this.handleExpandAll = this.handleExpandAll.bind(this);
    this.state = {
      sections: {
        generalInformation: true,
        locationSection: true,
      },
    };

    this.cViewMetaData = props.stripes.connect(ViewMetaData);
    this.cLocationList = props.stripes.connect(LocationList);
  }

  translate(id) {
    return this.props.stripes.intl.formatMessage({
      id: `ui-organization.settings.servicePoints.${id}`
    });
  }

  handleExpandAll(sections) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections = sections;
      return newState;
    });
  }

  handleSectionToggle({ id }) {
    this.setState((curState) => {
      const newState = cloneDeep(curState);
      newState.sections[id] = !newState.sections[id];
      return newState;
    });
  }

  render() {
    const servicePoint = this.props.initialValues;
    const { sections } = this.state;

    return (
      <div>
        <Row end="xs">
          <Col xs>
            <ExpandAllButton accordionStatus={sections} onToggle={this.handleExpandAll} />
          </Col>
        </Row>
        <Accordion
          open={sections.generalInformation}
          id="generalInformation"
          onToggle={this.handleSectionToggle}
          label={this.translate('generalInformation')}
        >
          {servicePoint.metadata && servicePoint.metadata.createdDate &&
            <Row>
              <Col xs={12}>
                <this.cViewMetaData metadata={servicePoint.metadata} />
              </Col>
            </Row>
          }
          <Row>
            <Col xs={4}>
              <KeyValue label={this.translate('name')} value={servicePoint.name} />
              <KeyValue label={this.translate('code')} value={servicePoint.code} />
              <KeyValue label={this.translate('discoveryDisplayName')} value={servicePoint.discoveryDisplayName} />
            </Col>
          </Row>
          <Row>
            <Col xs={8}>
              <KeyValue label={this.translate('description')} value={servicePoint.description} />
            </Col>
          </Row>
          <Row>
            <Col xs={4}>
              <KeyValue label={this.translate('shelvingLagTime')} value={servicePoint.shelvingLagTime} />
            </Col>
          </Row>
          <Row>
            <Col xs={2}>
              <KeyValue label={this.translate('pickupLocation')} value={servicePoint.pickupLocation ? 'Yes' : 'No'} />
            </Col>
          </Row>
        </Accordion>
      </div>
    );
  }
}

export default ServicePointDetail;
