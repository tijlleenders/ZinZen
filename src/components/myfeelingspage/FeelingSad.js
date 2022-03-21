import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'

const FeelingSad = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Sad
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Sad
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Lonely
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Gloomy
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Disappointed
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Miserable
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Hopeless
                </Button>

            </Container>
        </div>
    )
}

export default FeelingSad
