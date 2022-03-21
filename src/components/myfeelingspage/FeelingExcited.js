import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'

const FeelingExcited = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Excited
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Excited
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Amused
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Top of the world
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Proud
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Compassionate
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Cheerful
                </Button>

            </Container>
        </div>
    )
}

export default FeelingExcited
