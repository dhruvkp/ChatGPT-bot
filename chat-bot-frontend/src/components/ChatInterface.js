import React from "react";
import axios from 'axios';


class ChatInterface extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            context: [
                {'system': ''},
            ],
            prompt: "",
        }
    }

    fetchContext = (context) => {
        this.setState({
            context: context,
        });
    }

    updateContext = (prompt, agent) => {
        let context = [...this.state.context];
        if(agent === 'user'){
            context.push({'user': prompt});
        } else {
            context.push({'assistant': prompt});
        }

        this.setState({
            context: context
        })
    } 

    fetchChatResponse = (event) => {
        event.preventDefault();
        const prompt = this.state.prompt;
        let objContext = {...this.state.context};
        let context = objContext.context;
        
        axios.post('http://172.214.105.49:5000/', {
            prompt: prompt,
            context: context,
        }).then((response) =>{
            this.setState({
                context: response?.data,
                prompt: ""
            })
        }).catch(error => console.log(error));
    }

    componentDidMount() {
        axios.get('http://172.214.105.49:5000/').then(response => {
            this.fetchContext(response.data);
            }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return <>
            <head>
            <title>CarBot</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css"/>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
            <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
            </head>
            <body>
                <div class="jumbotron jumbotron-fluid  d-flex flex-column justify-content-end text-left">
                    <h2>Meet CarBot</h2>
                    <h4>Your AI assitant that help you buy or sell used cars. Ask your questions to CarBot below...</h4>
                    <ul class="list-group">
                        {Array.isArray(this.state.context.context) ? this.state.context.context.map((cntx, idx) => {
                        const role = cntx['role'];
                        const dialogue = cntx['content'];

                        if(role==='user')
                            return <li class="list-group-item" key={idx}>User: {dialogue} <br /></li>
                        else if(role==='assistant')
                            return <li class="list-group-item" key={idx}>CarBot: {dialogue} <br /></li>
                        return<></>;
                    }) : <></>}
                    </ul>
                    <form>
                        <div class="input-group">
                            <input type="text" class="form-control" value={this.state.prompt}
                                onChange={(e) => this.setState({prompt: e.target.value})} 
                                placeholder="Ask anything to CarBot..." required/>
                            <div class="input-group-btn">
                            <button class="btn btn-default" type="submit" onClick={this.fetchChatResponse}>
                                send
                            </button>
                            </div>
                        </div>
                    </form>
            </div>
            </body>
        </>
    }
}

export default ChatInterface;
