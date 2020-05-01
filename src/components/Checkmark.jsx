import React from 'react'
import '../css/Check.scss'

function Checkmark(props) {

    let classNames = require('classnames');

    let loaderClasses = classNames({
        'circle-loader': true,
        'load-complete': props.finish
    })

    return (
        <div>
            <div className={loaderClasses}>
                <div style={{display: props.finish ? "block" : "none"}} className="checkmark draw"></div>
            </div>
        </div>
    )
}

export default Checkmark