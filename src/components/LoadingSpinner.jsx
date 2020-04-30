import React from 'react'
import BounceLoader from 'react-spinners/BounceLoader';
import colors from '../constants/colors'

function LoadingSpinner(props) {
    return (
        <div className={props.className}>
            <BounceLoader
                size={150}
                color={colors.accent}
                loading={true}
                css={styles.spinner}
            />
        </div>
    )
}

const styles = {
    spinner: {
        marginTop: '150px',
        marginLeft: 'auto',
        marginRight: 'auto',
    }
}

export default LoadingSpinner