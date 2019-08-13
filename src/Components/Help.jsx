import React from "react"

export default class extends React.Component {
    render() {
        return (
            <div className="help">
                WARNING: this game can get seriously addictive and it's very easy to lose track of time while playing it. 
                <br/><br/>
                In order to win the game, you must reveal all the squares that DO NOT contain a mine, whether you flag them or not is a matter of personal preference. If a mine is revealed, the player loses. 
                <br/><br/>
                To flag a mine, the player must right-click on a mine. 
                <br/><br/>
                Click/tap any square to begin. Hopefully a large portion of the grid will be revealed. If it isn't, just keep trying until it does or until you lose, in which case start a new game (or ragequit). 
                <br/><br/>
                The number displayed in each square represents how many mines are adjacent to that square. There are a total of 8 adjacent squares per square (left, right, up, down and one at each corner). 
                <br/><br/>
                Flag the mine so you remember where it is and don't click it by accident. Flagged squares cannot be revealed. To unflag a square, right-click it while it is flagged. 
                <br/><br/>
                Once all the specified number of adjacent mines are flagged, you are free to click the remaining adjacent squares surrounding the numbered square. 
                <br/><br/>
                Once all the free blocks have been revealed, then you win!
            </div>
        )
    }
}
