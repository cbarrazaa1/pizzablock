import React, {useState, useEffect} from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Chart from './Chart';
import {totalPizzetos, totalRevenue, totalVisitors} from './../services/admin';
import LoadingSpinner from './LoadingSpinner';
import Table from 'react-bootstrap/Table';
import {usersDataLastMonth} from '../services/admin';

function ChartDeck(props) {
  const [revenue, setRevenue] = useState(0);
  const [pizzetos, setPizzetos] = useState(0);
  const [visitors, setVisitors] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getValues();
  }, []);

  const getValues = () => {
    totalPizzetos()
      .then((response) => {
        setPizzetos(response.revenue);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(true);
    totalRevenue()
      .then((response) => {
        setRevenue(response.revenue);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    totalVisitors()
      .then((response) => {
        setVisitors(response.visits);
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

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
                <Nav.Link eventKey="fifth">Pizzetos Spent</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="sixth">Unique Visits</Nav.Link>
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
                      <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Games played</th>
                                <th>Balance</th>
                                <th>Date created at</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersDataLastMonth().map((u, i) => {
                                return (
                                    <tr>
                                        <td>{u.user_name}</td>
                                        <td>{u.games.length}</td>
                                        <td>{u.balance} pizzetos</td>
                                        <td>{u.createdAt}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <Card>
                  <Card.Body>
                    <Card.Title>Revenue</Card.Title>
                    <Card.Body>
                      <p>Total Revenue: ${revenue} </p>
                      <Chart id="4" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <Card>
                  <Card.Body>
                    <Card.Title>Pizzetos Spent</Card.Title>
                    <Card.Body>
                      <p>Total Pizzetos Spent: ${pizzetos}</p>
                      <Chart id="5" />
                    </Card.Body>
                  </Card.Body>
                </Card>
              </Tab.Pane>
              <Tab.Pane eventKey="sixth">
                <Card>
                  <Card.Body>
                    <Card.Title>Unique Visits in Page</Card.Title>
                    <Card.Body>
                      <p>Total Unique Visits: {visitors} </p>
                      <Chart id="6" />
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
