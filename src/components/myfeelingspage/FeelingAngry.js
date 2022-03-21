import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'

const FeelingAngry = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Sad
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Annoyed
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Frustated
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Bitter
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Infuriated
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Mad
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Insulted
                </Button>

            </Container>
        </div>
    )
}

export default FeelingAngry
