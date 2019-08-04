import React from "react"
import "./Block.css"

export default class Block extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isMine: props.isMine || false,
            revealed: false,
            flagged: false
        }
    }

    mineAt = (x, y) =>
    	y >= 0 && y < this.props.field.length &&
    	x >= 0 && x < this.props.field[0].length &&
    	this.props.field[x][y].props.isMine

    minesNear() {
        let mines = 0

        const x = this.props.position.x,
        	y = this.props.position.y

        // check mines in all directions
        mines += this.mineAt(x - 1, y - 1);  // NW
        mines += this.mineAt(x - 1, y);      // N
        mines += this.mineAt(x - 1, y + 1);  // NE
        mines += this.mineAt(x, y - 1);      // W
        mines += this.mineAt(x, y + 1);      // E
        mines += this.mineAt(x + 1, y - 1);  // SW
        mines += this.mineAt(x + 1, y);      // S
        mines += this.mineAt(x + 1, y + 1);  // SE

	    return mines > 0 ? mines.toString() : ""
    }

    revealBlock() {
        if(this.state.revealed || this.state.flagged) return

        this.props.blockClick(this.state.isMine)
        this.setState({ revealed: true })
    }

    flagBlock(e) {
    	e.preventDefault()
        if(this.state.revealed) return
    	this.setState({flagged: !this.state.flagged})
    }

    render() {
    	const optionalProps = {}
    	if(this.state.revealed) optionalProps["data-count"] = this.minesNear()

        return (
        	<div
        		className={"block" + (
	            	this.state.revealed ? (" " + (this.state.isMine ? "mine" : "clear")) : ""
	        	)}
	        	{...optionalProps}
	        	onClick={this.revealBlock.bind(this)}
	        	onContextMenu={this.flagBlock.bind(this)}
	    	>
	    		{this.state.revealed ? (
	    			this.state.isMine ? (
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
    				) : this.minesNear()
    			) : (
    				this.state.flagged ? (
		    			<svg className="flag" viewBox="0 0 512 512">
		    				<path fill="currentColor" d={
		    					"M349.565 98.783C295.978 98.783 251.721 64 184.348 64c-24.955 0-47.309 4.384-68.045 12.013a55.947 55.947 "+
		    					"0 0 0 3.586-23.562C118.117 24.015 94.806 1.206 66.338.048 34.345-1.254 8 24.296 8 56c0 19.026 9.497 35.825 "+
		    					"24 45.945V488c0 13.255 10.745 24 24 24h16c13.255 0 24-10.745 24-24v-94.4c28.311-12.064 63.582-22.122 "+
		    					"114.435-22.122 53.588 0 97.844 34.783 165.217 34.783 48.169 0 86.667-16.294 122.505-40.858C506.84 359.452 "+
		    					"512 349.571 512 339.045v-243.1c0-23.393-24.269-38.87-45.485-29.016-34.338 15.948-76.454 31.854-116.95 31.854z"
	    					} />
						</svg>
	    			) : null
    			)}
    		</div>
		)
    }
}
