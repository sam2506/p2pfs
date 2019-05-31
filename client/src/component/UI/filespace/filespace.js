import React,{Component} from 'react';
import './filespace.css';
import Toolbar from '../../toolbar/toolbar';
import Filedetails from '../../filedetails/filedetails';

class filespace extends Component{
    state={
        files:[],
        searchText: ""
    }
    storeUploadedFiles=(file)=>{
        var Files=this.state.files;
        Files.push(file);
        this.setState({files:Files});
    }
    changeSearch=(text)=>{
        this.setState({searchText: text});
    }
    render(){
        //console.log(this.state.files);
        return(
            <div className="filespace">
                <Toolbar changeSearch={this.changeSearch} storeFile={this.storeUploadedFiles} email={this.props.email}/>
                <Filedetails searchText={this.state.searchText} filesData={this.state.files} email={this.props.email}/>
            </div>
        )
    }
}
export default filespace;