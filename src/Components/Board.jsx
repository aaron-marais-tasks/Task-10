import React from "react"
import Block from "./Block.jsx"
import "./Board.css"

export default class extends React.Component {
    constructor(props) {
        super(props)

        const state = {
            blocks: this.blockLayout(20), // 20x20
            blockRegister: []
        }
        for(let i = 0; i < 20; i++) {
            state.blockRegister[i] = []
        }
        this.state = state
    }

    revealAroundCoord = (x, y) => {
        this.revealCell(x - 1, y - 1)
        this.revealCell(x - 1, y)
        this.revealCell(x - 1, y + 1)
        this.revealCell(x + 1, y)

        this.revealCell(x, y - 1)
        this.revealCell(x, y + 1)
        this.revealCell(x + 1, y - 1)
        this.revealCell(x + 1, y + 1)
    }

    revealAround = (x, y) => () => {
        this.revealCell(x - 1, y - 1)
        this.revealCell(x - 1, y)
        this.revealCell(x - 1, y + 1)
        this.revealCell(x + 1, y)

        this.revealCell(x, y - 1)
        this.revealCell(x, y + 1)
        this.revealCell(x + 1, y - 1)
        this.revealCell(x + 1, y + 1)
    }

    revealCell(x, y) {
        if(!(this.state.blockRegister[x] && this.state.blockRegister[x][y])) return

        const block = this.state.blockRegister[x][y]
        if(block.isMine) return
        if(block.revealed) return

        block.revealed = true

        block.reveal()
        if(block.clear()) {
            this.revealAroundCoord(x, y)
        }
    }

    registerBlock = (x,y) => block => {
        const register = this.state.blockRegister
        register[x][y] = block
        this.setState({blockRegister: register})
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
                blocks[x][y] = <Block key={x+"_"+y} register={this.registerBlock(x, y)} revealAround={this.revealAround(x, y)} field={blocks} position={{x,y}} isMine={false} blockClick={this.blockClick} />
            }
        }

        let blockCount = 0
        while(blockCount < amount * 2.5) {
            const x = Math.floor(Math.random() * amount),
                y = Math.floor(Math.random() * amount)

            if(!blocks[x][y].isMine) {
                blockCount++
                blocks[x][y] = <Block isMine={true} register={this.registerBlock(x,y)} revealAround={this.revealAround(x, y)} field={blocks} position={{x,y}} blockClick={this.blockClick} key={blockCount} />
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
