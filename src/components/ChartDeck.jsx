import React from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Chart from './Chart';

function ChartDeck(props) {
  return (
    <div>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Games Played</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Items Purchased</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">New Users</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">Revenue</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fifth">Unique Visits</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <Card>
                  <Card.Body>
                    <Card.Title>Games played from Last Month</Card.Title>
                    <Card.Body>
                      <Chart id="1" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <Card>
                  <Card.Body>
                    <Card.Title>Shopped Items from Last Month</Card.Title>
                    <Card.Body>
                      <Chart id="2" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <Card>
                  <Card.Body>
                    <Card.Title>
                      New Users Registered from Last Month
                    </Card.Title>
                    <Card.Body>
                      <Chart id="3" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <Card>
                  <Card.Body>
                    <Card.Title>Revenue</Card.Title>
                    <Card.Body>
                      <Chart id="4" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <Card>
                  <Card.Body>
                    <Card.Title>Unique Visits in Page</Card.Title>
                    <Card.Body>
                      <Chart id="5" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default ChartDeck;
