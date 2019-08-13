/*
    This file holds our board blocks
*/

// Import React and styling into scope
import React from "react"
import "./Block.css"

// Export Block anonymous class
export default class extends React.Component {
    // Constructor for setting custom state
    constructor(props) {
        super(props)

        // Set our initial
        this.state = {
            revealed: false,        // If revealed
            flagged: false,         // If flagged
            enabled: true,          // If enabled (clickable)
            won: false,
            alive: true
        }

        // Get our position on the board
        const {x, y} = props.position

        // Register self by position
        props.register(x, y, {
            disable: () => this.setState({enabled: false}), // disable block
            reveal: this.revealBlock.bind(this),            // reveal block
            clear: () => this.minesNear() === "",           // if block is clear
            isMine: this.props.isMine,                      // if block is mine
            flagged: () => this.state.flagged               // if block is flagged
        })
    }

    // When component is updated (board reset)
    componentDidUpdate(prevProps) {
        if(this.props.field.map(i => i.length).reduce((a, b) => a + b) < 20*20) {
            // Get our position on the board
            const {x, y} = this.props.position

            // Register self by position
            this.props.register(x, y, {
                disable: () => this.setState({enabled: false}), // disable block
                reveal: this.revealBlock.bind(this),            // reveal block
                clear: () => this.minesNear() === "",           // if block is clear
                isMine: this.props.isMine,                       // if block is mine
                flagged: () => this.state.flagged               // if block is flagged
            })

            this.setState({
                revealed: false,            // If revealed
                flagged: false,             // If flagged
                enabled: true,              // If enabled (clickable)
                won: false,
                alive: true
            })
        }

        if(this.props.won === false && this.state.alive !== this.props.alive) {
            this.setState({alive: this.props.alive})
        }
    }

    // Get the block register at a certain position 
    // row ? (block || empty) : empty
    blockAt = (x, y) => this.props.field[x] ? this.props.field[x][y] || {} : {}

    // Get blocks around a position
    blocksAround() {
        // Our current position
        const {x, y} = this.props.position

        // Our directions in which to check
        const directions = [
            [x-1, y-1], [x-1, y], [x-1, y+1],  // NW, N, NE
            [x,   y-1],           [x,   y+1],  //  W,     E
            [x+1, y-1], [x+1, y], [x+1, y+1]   // SW, S, SE
        ]

        // Map over directions and change to block registers
        return directions.map(direction => this.blockAt(...direction))
    }

    // Check for mines near current block
    minesNear() {
        // The amount of mines near our block
        // Gets blocks around, filters out mines, and checks length
        const count = this.blocksAround()
            .filter(block => block && block.isMine)
            .length

        // If more than 0 mines around current block, send amount; otherwise empty
        return count > 0 ? count.toString() : ""
    }

    // Check if all mines nearby are flagged
    minesNearAreFlagged() {
        // Get mines around current block
        const minesAround = this.blocksAround()
            .filter(block => block && block.isMine)

        // If more than 0 mines, make sure that every mine is flagged; otherwise true
        return minesAround.length > 0 ? minesAround.every(block => block.flagged()) : true
    }

    // Reveal this block
    revealBlock(bubble=true, won=false, wrong=false) {
        if(wrong) {
            this.setState({incorrectFlag: true})
            return
        }
        
        // If block is flagged, enabled, or we're dead, don't allow action
        if(this.state.flagged || !this.state.enabled || !this.props.isAlive() || this.state.won) return

        console.log(bubble, won, wrong)

        // If block is revealed
        if(this.state.revealed) {
            // If we have mines near us, and they're not all flagged, stop execution
            if(this.minesNear() && !this.minesNearAreFlagged()) return

            // Get our current position, and reveal close blocks
            if(bubble) {
                const {x, y} = this.props.position
                this.props.revealClose(x, y)
            }

            return
        }

        // Send click event to our parent and set our revealed state to true
        if(bubble) this.props.click(this.props.position)
        else if(won) this.setState({won: true})
        this.setState({ revealed: true })
    }

    // Flag current block
    flagBlock(e) {
        // Stop context menu from popping up
        e.preventDefault()

        // Stop execution if revealed already
        if(this.state.revealed) return

        // If current flagged state is false and we already have max flags, stop execution
        if(!this.state.flagged && this.props.maxFlagsReached()) return

        // Reverse our flagged state
        this.setState({flagged: !this.state.flagged}, () => {
            // When state is complete, increment or decrement the board flag counter,
            // based on if this was a flag or not
            if(this.state.flagged) this.props.addFlag()
            else this.props.removeFlag()
        })
    }

    // Render our block
    render() {
        // Optional props; if revealed, set our data-count to the amount
        // of mines near us
        const optionalProps = {}
        if(this.state.revealed) optionalProps["data-count"] = this.minesNear()

        return (
            /* Div container for block
                Class name depends on current state (if revealed, is won and if is mine)
                Pass in optional props
                On click handler
                On right click handler */
            <div
                className={"block" + (
                    this.state.revealed ? (" " + (this.props.isMine || this.state.won ? "mine" : "clear")) : ""
                )}
                {...optionalProps}
                onClick={this.revealBlock.bind(this)}
                onContextMenu={this.flagBlock.bind(this)}
            >
                {/* If it is revealed, show icon or text */}
                {this.state.revealed || this.state.won ? (
                    // If is mine, show bomb
                    this.props.isMine ? (
                        <svg className="bomb" viewBox="0 0 512 512">
                            <path fill="currentColor" d={"M384.5 144.5l56-56-17-17-56 56-52.2-52.2c-6.2-6.2-16.4-6.2-22.6 0l-28.4 "+
                                "28.4c-17.9-5-36.8-7.7-56.3-7.7C93.1 96 0 189.1 0 304s93.1 208 208 208 208-93.1 "+
                                "208-208c0-19.5-2.7-38.4-7.7-56.3l28.4-28.4c6.2-6.2 6.2-16.4 0-22.6l-52.2-52.2zm-30 89.1c7.9 28.2 "+
                                "13.5 43.9 13.5 70.4 0 88.4-71.6 160-160 160S48 392.4 48 304s71.6-160 160-160c26.3 0 41.4 5.4 70.4 "+
                                "13.5l25.6-25.6 76.1 76.1-25.6 25.6zM512 72c0 6.6-5.4 12-12 12h-24c-6.6 0-12-5.4-12-12s5.4-12 "+
                                "12-12h24c6.6 0 12 5.4 12 12zm-60-60v24c0 6.6-5.4 12-12 12s-12-5.4-12-12V12c0-6.6 5.4-12 12-12s12 "+
                                "5.4 12 12zm5 43c-4.7-4.7-4.7-12.3 0-17l17-17c4.7-4.7 12.3-4.7 17 0 4.7 4.7 4.7 12.3 0 17l-17 "+
                                "17c-4.7 4.7-12.3 4.7-17 0zm-67.9-16.9c-4.7-4.7-4.7-12.3 0-17 4.7-4.7 12.3-4.7 17 0l17 17c4.7 4.7 "+
                                "4.7 12.3 0 17-4.7 4.7-12.3 4.7-17 0l-17-17zm101.8 67.8c4.7 4.7 4.7 12.3 0 17-4.7 4.7-12.3 4.7-17 "+
                                "0l-17-17c-4.7-4.7-4.7-12.3 0-17 4.7-4.7 12.3-4.7 17 0l17 17zM216 208c0 13.3-10.7 24-24 24-30.9 "+
                                "0-56 25.1-56 56 0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.3 46.7-104 104-104 13.3 0 24 10.7 24 24z"}
                            />
                        </svg>
                    ) : 
                    // If not bomb, show text (amount of mines close)
                    this.minesNear()
                ) : (
                    // If flagged, show flag icon
                    this.state.flagged ? (
                        <React.Fragment>
                            <svg className="flag" viewBox="0 0 512 512">
                                <path fill="currentColor" d={
                                    "M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 "+
                                    "0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 "+
                                    "24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 "+
                                    "114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 "+
                                    "512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"
                                } />
                            </svg>
                            {this.state.incorrectFlag ? (
                                <svg className="wrong" viewBox="0 0 320 512">
                                    <path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path>
                                </svg>
                            ) : null}
                        </React.Fragment>
                    ) : null
                )}
            </div>
        )
    }
}
