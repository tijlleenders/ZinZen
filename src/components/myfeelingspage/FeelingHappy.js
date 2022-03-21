import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container,  } from 'react-bootstrap'

const FeelingHappy = () => {
    return (
        <div>
            <Container fluid>

                <Button variant="peach" size="lg" className="feelings-title">
                    Happy
                </Button>
                <br />
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Happy
                </Button>
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Loved
                </Button>
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Relieved
                </Button>
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Content
                </Button>
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Peaceful
                </Button>
                <Button className= "btn-my-feelings btn-feelings" size="lg">
                    Joyful
                </Button>

            </Container>
        </div>
    )
}

export default FeelingHappy
