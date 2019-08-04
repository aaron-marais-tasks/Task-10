import React from "react"
import Block from "./Block.jsx"
import "./Board.css"

export default class extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            blocks: this.blockLayout(20) // 20x20
        }
    }

    blockClick = isMine => {
        if(isMine) console.log(isMine, "BOOM")
        else console.log(isMine, "Safe brah")
    }

    blockLayout(amount=20) {
        const blocks = new Array(amount)

        for(let x = 0; x < 20; x++) {
            blocks[x] = new Array(amount)
            for(let y = 0; y < 20; y++) {
                blocks[x][y] = <Block key={x+"_"+y} field={blocks} position={{x,y}} isMine={false} blockClick={this.blockClick} />
            }
        }

        let blockCount = 0
        while(blockCount < amount * 2) {
            const x = Math.floor(Math.random() * amount),
                y = Math.floor(Math.random() * amount)

            if(!blocks[x][y].isMine) {
                blockCount++
                blocks[x][y] = <Block isMine={true} field={blocks} position={{x,y}} blockClick={this.blockClick} key={blockCount} />
            }
        }

        return blocks
    }

    render() {
        return (
            <div className="board">
                {this.state.blocks.map((blocks, index) => (
                    <div className="blockRow" key={index}>{blocks}</div>
                ))}
            </div>
        )
    }
}
