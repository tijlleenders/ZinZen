import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'

const FeelingAfraid = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Afraid
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Worried
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Doubtful
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Nervous
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Anxious
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Panicked
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Stressed
                </Button>

            </Container>
        </div>
    )
}

export default FeelingAfraid
