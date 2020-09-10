import React, {Component} from 'react';
import {withRouter, Redirect} from "react-router-dom";
import {connect} from "react-redux";
import {compose} from "redux";
import {isLoaded, isEmpty} from "react-redux-firebase";

const withPermissionHoc = (acceptedRoles=['admin', ]) => (OriginalComponent) => {
    class WithPermissionHoc extends Component {
        render() {
            if (isLoaded(this.props.profile)) {
                if (!isEmpty(this.props.profile)){
                    if (acceptedRoles.includes(this.props.profile.role)) {
                        return <OriginalComponent {...this.props}/>
                    }
                }
                console.log('You do not have permission!')
                return <Redirect to={'/'}/>
            } else {
                return <div>Loading...(HOC)</div>
            }
        }
    }

    return compose(
        withRouter,
        connect(
            ({firebase: {auth, profile}}) => ({
                auth,
                profile
            })),
        )(WithPermissionHoc)
}

export default withPermissionHoc;