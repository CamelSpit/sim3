import React, { Component } from 'react';
import {connect} from "react-redux";
import {userInfo} from '../ducks/reducer';

class Dashboard extends Component{

    componentDidMount(){
        this.props.userInfo()
    }

    render(){
        return(
            <div>
                {this.props.user}
            </div>
        )
    }
}

function mapStateToProps(state){ //whatever we return here is merged with the props object for this component.
    return{ 
        user: state.user
    }
}

export default connect(mapStateToProps,{userInfo})(Dashboard) //mapStateToProps connects the incoming state from the store to the props object received by this component. It also connects the userInfo function to the props object for the Dashboard component. 