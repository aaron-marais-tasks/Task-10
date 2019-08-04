import React from "react"

export default class Block extends React.Component {
    state = {
        isMine: false
    }

    revealBlock() {
        
    }

    render() {
        return <div className="block" />
    }
}

Block.Mine = class extends Block {
    state = {
        isMine: true
    }
}
