import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'

const FeelingGratitude = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Gratitude
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Harmony
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Thankful
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Triumphed
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Worthy
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Satisfied
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Awed
                </Button>

            </Container>
        </div>
    )
}

export default FeelingGratitude
