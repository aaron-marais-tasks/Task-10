import React from "react"
import Block from "./Block.jsx"
import "./Board.css"

export default class extends React.Component {
    constructor(props) {
        super(props)

        const state = {
            alive: true,
            blocks: [], // 20x20
            blockRegister: [],
            flags: 0,
            timer: null,
            time: 0
        }
        for(let i = 0; i < 20; i++) {
            state.blockRegister[i] = []
        }
        this.state = state
    }

    componentDidMount() {
        this.setState({
            blocks: this.blockLayout(20)
        })
    }

    maxFlagsReached = () => this.state.flags >= 20
    setFlag = op => this.setState({flags: op(this.state.flags)})

    getBlock = (x, y) => this.state.blockRegister[x] && this.state.blockRegister[x][y]

    revealAround = (x, y) => {
        this.revealCell(x - 1, y - 1, true)
        this.revealCell(x - 1, y, true)
        this.revealCell(x - 1, y + 1, true)
        this.revealCell(x + 1, y, true)

        this.revealCell(x, y - 1, true)
        this.revealCell(x, y + 1, true)
        this.revealCell(x + 1, y - 1, true)
        this.revealCell(x + 1, y + 1, true)
    }

    revealCell(x, y, revealingAround=false) {
        const block = this.getBlock(x, y)
        if(!block) return
        if(block.isMine || block.revealed) return

        block.revealed = true
        block.reveal()
        if(block.clear()) {
            this.revealAround(x, y)
        }
    }

    registerBlock = (x, y, block) => {
        const register = this.state.blockRegister
        register[x][y] = block
        this.setState({blockRegister: register})
    }

    blockClick = ({x,y}) => {
        const block = this.getBlock(x, y)
        if(!block) return

        if(block.isMine) {
            clearInterval(this.state.timer)
            this.setState({alive: false})
        } else {
            if(this.state.timer === null) {
                this.setState({
                    timer: setInterval(
                        () => this.setState({time: ++this.state.time}),
                        1000
                    )
                }, () => this.revealAround(x, y))
                return
            }
            if(block.clear()) {
                this.revealAround(x, y)
            }
        }
    }

    isAlive = () => this.state.alive

    blockLayout(amount=20) {
        const blocks = new Array(amount)

        const blockmux = {
            isMine: false,
            click: this.blockClick.bind(this),
            register: this.registerBlock.bind(this),
            revealClose: this.revealAround.bind(this),
            field: this.state.blockRegister,
            isAlive: this.isAlive,
            maxFlagsReached: this.maxFlagsReached.bind(this),
            addFlag: () => this.setFlag(f => ++f),
            removeFlag: () => this.setFlag(f => --f)
        }

        for(let x = 0; x < 20; x++) {
            blocks[x] = new Array(amount)
            for(let y = 0; y < 20; y++) {
                blocks[x][y] = <Block key={x+"_"+y} position={{x,y}} {...blockmux} />
            }
        }

        let blockCount = 0
        blockmux.isMine = true
        while(blockCount < amount * 2.5) {
            const x = Math.floor(Math.random() * amount),
                y = Math.floor(Math.random() * amount)

            if(!blocks[x][y].isMine) {
                blockCount++
                blocks[x][y] = <Block key={x+"_"+y} position={{x,y}} {...blockmux} />
            }
        }

        return blocks
    }

    resetBoard() {
        const blockRegister = []
        for(let i = 0; i < 20; i++) {
            blockRegister[i] = []
        }

        if(this.state.timer !== null) {
            clearInterval(this.state.timer)
        }
        this.setState({
            blockRegister,
            flags: 0,
            alive: true,
            flags: 0,
            timer: null,
            time: 0
        }, () => this.setState({
            blocks: this.blockLayout(20)
        }))
    }

    render() {
        return (
            <div className="game">
                <div className="info">
                    <div className="flags">
                        {20 - this.state.flags}
                    </div>

                    {this.state.alive ? (
                        <svg viewBox="0 0 496 512" onClick={this.resetBoard.bind(this)}>
                            <path fill="currentColor" d={
                                "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 "+
                                "0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 "+
                                "32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 "+
                                "14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-"+
                                "11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 "+
                                "7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
                            } />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 496 512" onClick={this.resetBoard.bind(this)}>
                            <path fill="currentColor" d={
                                "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-"+
                                "200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-"+
                                "32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32"+
                                "-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7."+
                                "1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5"+
                                " 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"
                            } />
                        </svg>
                    )}

                    <div className="time">
                        {this.state.time}
                    </div>
                </div>
                <div className="board">
                    {this.state.blocks.map((blocks, index) => (
                        <div className="blockRow" key={index}>{blocks}</div>
                    ))}
                </div>
            </div>
        )
    }
}
