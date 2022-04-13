import React from "react";

import { FeelingHappy } from "./FeelingHappy";
import { FeelingExcited } from "./FeelingExcited";
import { FeelingGratitude } from "./FeelingGratitude";
import { FeelingSad } from "./FeelingSad";
import { FeelingAfraid } from "./FeelingAfraid";
import { FeelingAngry } from "./FeelingAngry";

export const MyFeelingsChoices = () => {
    return (
        <div>
            <FeelingHappy />
            <FeelingExcited />
            <FeelingGratitude />
            <FeelingSad />
            <FeelingAfraid />
            <FeelingAngry />
        </div>
    );
};
