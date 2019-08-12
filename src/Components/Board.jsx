/*
    This file holds my board component
*/

// Import React library, Block component and board styling into scope
import React from "react"
import Block from "./Block.jsx"
import "./Board.css"

// Export the Board anonymous class
export default class extends React.Component {
    // Constructor to set initial state
    constructor(props) {
        super(props)

        // Initial state
        const state = {
            alive: true,        // Start off alive
            blocks: [],         // Holds blocks
            blockRegister: [],  // Block register for child control
            flags: 0,           // Amount of flags placed
            timer: null,        // Play timer
            time: 0,            // Amount of time played for
            won: false          // If player won
        }

        // Full block register with empty arrays
        for(let i = 0; i < 20; i++) {
            state.blockRegister[i] = []
        }

        // Set initial state
        this.state = state
    }

    componentDidMount() {
        // After component mounts, setup block layout
        this.setState({
            blocks: this.blockLayout(20)
        })
    }

    // Helper functions to limit flag placement in children
    maxFlagsReached = () => this.state.flags >= 20 * 2.5
    setFlag = op => this.setState({flags: op(this.state.flags)})

    // Helper function for children to determine if alive
    isAlive = () => this.state.alive

    // Returns a block's register
    getBlock = (x, y) => this.state.blockRegister[x] && this.state.blockRegister[x][y]

    // Get blocks around another block
    getAround = (x, y) => {
        // Array to hold direction we check
        const directions = [
            [x-1, y-1], [x-1, y], [x-1, y+1],   // NW, N, NE
            [x,   y-1],           [x,   y+1],   // W, E
            [x+1, y-1], [x+1, y], [x+1, y+1]    // SW, S, SE
        ]
        return directions
    }

    // Reveal blocks around another block
    revealAround = (x, y) => {
        this.getAround(x, y).forEach(direction => this.revealCell(...direction, true))
    }

    // Reveal specific cell, and boolean operator if revealing around.
    // Only used by revealAround
    revealCell(x, y, revealingAround=false) {
        // If no block in register, stop execution
        const block = this.getBlock(x, y)
        if(!block) return

        // Don't reveal if the block is a mine or is revealed
        if(block.isMine || block.revealed) return

        // Set block register's revealed flag on and reveal block
        block.revealed = true
        block.reveal()

        // Reveal around the current block if the current block isn't touching a bomb
        if(block.clear() && revealingAround) {
            this.revealAround(x, y)
        }

        this.checkWin()
    }

    // Check if we've won
    checkWin = () => {
        // Check if all blocks are revealed
        for (let x = 0; x < 20; x++) {
            for (let y = 0; y < 20; y++) {
                const block = this.getBlock(x, y)
                if(!block.revealed && !block.isMine) return
            }
        }

        // If all blocks are revealed, set win state and clear timer
        clearInterval(this.state.timer)
        this.setState({
            won: true,
            timer: null
        })
    }

    // Register a block into the board state; only called in child
    registerBlock = (x, y, block) => {
        // Get state's current register and add block into it
        const register = this.state.blockRegister
        register[x][y] = block
        this.setState({blockRegister: register})
    }

    // On block click; only called in child
    blockClick = ({x,y}) => {
        // If no block in register, stop execution
        const block = this.getBlock(x, y)
        if(!block) return

        // If the block is a mine, clear our interval and set alive flag to false
        if(block.isMine) {
            clearInterval(this.state.timer)
            this.setState({alive: false})
        } else 
        // If the block is not a mine, start our timer if it's not started already,
        // and reveal around the block if it's clear
        {
            // If timer doesn't exist, make it
            if(this.state.timer === null) {
                // Timer which updates every second
                const timer = setInterval(() => this.setState({time: this.state.time + 1}), 1000)

                // Add our timer into the state, and reveal around after state set
                this.setState({timer}, () => {
                    if(block.clear) this.revealAround(x, y)
                })

                // Stop below code from running if timer doesn't exist (since we do this in
                // setState callback)
                return
            }

            block.revealed = true

            // If block is clear, reveal around the block
            if(block.clear()) {
                this.revealAround(x, y)
            }

            this.checkWin()
        }
    }

    // Calculate block layout
    blockLayout(amount=20) {
        // New array of 20 items
        const blocks = new Array(amount)

        // Our block mux holds properties we'll pass to blocks
        const blockmux = {
            isMine: false,                                      // if mine or not
            click: this.blockClick.bind(this),                  // board's onclick event
            register: this.registerBlock.bind(this),            // to register block
            revealClose: this.revealAround.bind(this),          // to reveal around
            field: this.state.blockRegister,                    // the block register
            isAlive: this.isAlive,                              // if game is alive
            maxFlagsReached: this.maxFlagsReached.bind(this),   // if max flags placed
            addFlag: () => this.setFlag(f => ++f),              // add a flag
            removeFlag: () => this.setFlag(f => --f)            // remove a flag
        }

        // Popluate the board's blocks array
        // Loop {amount} times for columns
        for(let x = 0; x < amount; x++) {
            // Create a new array for rows
            blocks[x] = new Array(amount)

            // Loop {amount} times for rows
            for(let y = 0; y < amount; y++) {
                // Set block in layout
                blocks[x][y] = <Block key={x+"_"+y} position={{x,y}} {...blockmux} />
            }
        }

        // Amount of mines placed
        let mineCount = 0

        // Update block mux to be mines only
        blockmux.isMine = true

        // Loop until all mines placed
        while(mineCount < amount * 2.5) {
            // Get a random position
            const x = Math.floor(Math.random() * amount),
                y = Math.floor(Math.random() * amount)

            // If there's not a mine placed at the random position, increment
            // mine counter, and add mine block into the array
            if(!blocks[x][y].isMine) {
                mineCount++
                blocks[x][y] = <Block key={x+"_"+y} position={{x,y}} {...blockmux} />
            }
        }

        return blocks
    }

    // Reset our board
    resetBoard() {
        // Our block register
        const blockRegister = []
        for(let i = 0; i < 20; i++) {
            blockRegister[i] = []
        }

        // If timer exists, clear it
        if(this.state.timer !== null) {
            clearInterval(this.state.timer)
        }

        // Reset our state
        this.setState({
            blockRegister,
            alive: true,
            flags: 0,
            timer: null,
            time: 0,
            won: false
        }, () => {
            // When our state is reset, update blocks
            this.setState({
                blocks: this.blockLayout(20)
            })
        })
    }

    getTime() {
        let minutes = Math.floor(this.state.time / 60).toString()
        let seconds = (this.state.time % 60).toString()

        if(minutes.length < 2) minutes = "0" + minutes
        if(seconds.length < 2) seconds = "0" + seconds

        return `${minutes}:${seconds}`
    }

    // Render our game
    render() {
        return (
            // Game container
            <div className="game">
                {/* Game information */}
                <div className="info">
                    {/* How many flags we have left */}
                    <div className="flags">
                        {20 * 2.5 - this.state.flags}
                    </div>

                    {/* Display a happy or sad face depending on our result */}
                    <svg viewBox="0 0 496 512" onClick={this.resetBoard.bind(this)}>
                        <path fill="currentColor" d={this.state.won ? (
                            "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm141.4 389.4c-37.8 37.8-88 58.6-141.4 58.6s-103.6-20.8-141.4-58.6S48 309.4 48 256s20.8-103.6 58.6-141.4S194.6 56 248 56s103.6 20.8 141.4 58.6S448 202.6 448 256s-20.8 103.6-58.6 141.4zM328 152c-23.8 0-52.7 29.3-56 71.4-.7 8.6 10.8 11.9 14.9 4.5l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.1-42.1-32-71.4-55.8-71.4zm-201 75.9l9.5-17c7.7-13.7 19.2-21.6 31.5-21.6s23.8 7.9 31.5 21.6l9.5 17c4.1 7.4 15.6 4 14.9-4.5-3.3-42.1-32.2-71.4-56-71.4s-52.7 29.3-56 71.4c-.6 8.5 10.9 11.9 15.1 4.5zM362.4 288H133.6c-8.2 0-14.5 7-13.5 15 7.5 59.2 58.9 105 121.1 105h13.6c62.2 0 113.6-45.8 121.1-105 1-8-5.3-15-13.5-15z"
                        ) : this.state.alive ? (
                            "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 "+
                            "0-200-89.7-200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 "+
                            "32-32s-14.3-32-32-32-32 14.3-32 32 14.3 32 32 32zm160 0c17.7 0 32-14.3 32-32s-14.3-32-32-32-32 "+
                            "14.3-32 32 14.3 32 32 32zm4 72.6c-20.8 25-51.5 39.4-84 39.4s-63.2-14.3-84-39.4c-8.5-10.2-23.7-"+
                            "11.5-33.8-3.1-10.2 8.5-11.5 23.6-3.1 33.8 30 36 74.1 56.6 120.9 56.6s90.9-20.6 120.9-56.6c8.5-10.2 "+
                            "7.1-25.3-3.1-33.8-10.1-8.4-25.3-7.1-33.8 3.1z"
                        ) : (
                            "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 448c-110.3 0-200-89.7-"+
                            "200-200S137.7 56 248 56s200 89.7 200 200-89.7 200-200 200zm-80-216c17.7 0 32-14.3 32-32s-14.3-"+
                            "32-32-32-32 14.3-32 32 14.3 32 32 32zm160-64c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32"+
                            "-14.3-32-32-32zm-80 128c-40.2 0-78 17.7-103.8 48.6-8.5 10.2-7.1 25.3 3.1 33.8 10.2 8.4 25.3 7."+
                            "1 33.8-3.1 16.6-19.9 41-31.4 66.9-31.4s50.3 11.4 66.9 31.4c8.1 9.7 23.1 11.9 33.8 3.1 10.2-8.5"+
                            " 11.5-23.6 3.1-33.8C326 321.7 288.2 304 248 304z"
                        )} />
                    </svg>

                    {/* The amount of time we've taken */}
                    <div className="time">
                        {this.getTime()}
                    </div>
                </div>

                {/* Our game board */}
                <div className="board">
                    {/* Map each row to be a div.blockRow */}
                    {this.state.blocks.map((blocks, index) => (
                        <div className="blockRow" key={index}>{blocks}</div>
                    ))}
                </div>
            </div>
        )
    }
}
