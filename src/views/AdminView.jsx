import React, {useState} from 'react';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck'
import Chart from '../components/Chart'


import globalStyles from '../constants/styles';

function AdminView(props) {

    return (
        <div>
            <CardDeck>
                <Card>
                    <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                        <Row>
                            <Col sm={3}>
                                <Nav variant="graphs" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">New Users</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Unique Visits</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="third">Number of Games</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="fourth">Revenue</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>
                                                    New Users in Time
                                            </Card.Title>
                                                <Card.Body>
                                                    <Chart id="1" />
                                                </Card.Body>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>
                                                    Unique Visits in Time
                                            </Card.Title>
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
                                                    Number of Games
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
                                                <Card.Title>
                                                    Revenue
                                            </Card.Title>
                                                <Card.Body>
                                                    <Chart id="4" />
                                                </Card.Body>
                                            </Card.Body>
                                        </Card>
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>            
                    </Tab.Container>
                </Card>
            </CardDeck>
        </div>
    )
    
}

export default AdminView