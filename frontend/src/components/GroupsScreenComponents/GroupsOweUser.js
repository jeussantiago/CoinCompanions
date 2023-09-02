import React from "react";
import { Card } from "react-bootstrap";

function GroupsOweUser({ groups }) {
    return (
        <div>
            <h3>Groups that owe you</h3>
            {groups.map((group) => (
                <div className="border border-primary" key={group.id}>
                    <Card className="mb-3" style={{ cursor: "pointer" }}>
                        <Card.Body>
                            <h5>{group.name}</h5>
                        </Card.Body>
                    </Card>
                </div>
            ))}
        </div>
    );
}

export default GroupsOweUser;
