import React from 'react';
import MQTT from 'mqtt';

class TypingBox extends React.Component {
constructor(props) {
super(props);
this.state = {
rollNo: '',
image: '',
text: ''
};
}

handleRollNoChange = event => {
this.setState({ rollNo: event.target.value });
}

handleImageChange = event => {
this.setState({ image: event.target.value });
}

handleTextChange = event => {
this.setState({ text: event.target.value });
this.sendTextToServer(event.target.value);
}

sendTextToServer(text) {
const client = MQTT.connect('mqtt://localhost:1883');
client.publish('text', text);
}

render() {
return (
<div>
<form>
<label>Roll No:</label>
<input type="text" value={this.state.rollNo} onChange={this.handleRollNoChange} />
<br />
<label>Image:</label>
<input type="file" value={this.state.image} onChange={this.handleImageChange} />
<br />
<label>Text:</label>
<textarea value={this.state.text} onChange={this.handleTextChange} />
</form>
</div>
);
}
}

export default TypingBox;