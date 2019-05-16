import React,{Component} from 'react';
import './filespace.css';
import Toolbar from '../../toolbar/toolbar';
import Filedetails from '../../filedetails/filedetails';

class filespace extends Component{
    state={
        files:[]
    }
    storeUploadedFiles=(file)=>{
        var Files=this.state.files;
        Files.push(file);
        this.setState({files:Files});
    }
    render(){
        //console.log(this.state.files);
        return(
            <div className="filespace">
                <Toolbar storeFile={this.storeUploadedFiles} email={this.props.email}/>
                <Filedetails filesData={this.state.files} email={this.props.email}/>
            </div>
        )
    }
}
export default filespace;