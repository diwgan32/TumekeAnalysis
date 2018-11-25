import React, { Component } from 'react';
import {Grid, Row, Col, Button} from 'react-bootstrap'
import { Scene} from 'react-babylonjs'
import { Vector3, ArcRotateCamera, MeshBuilder, HemisphericLight  } from 'babylonjs';

import 'whatwg-fetch';

import {
  getFromStorage,
  setInStorage,
} from '../../utils/storage';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      _canvas: null,
      _scene: null,
      modelNum: 0,
      _camera: null,
      currImg: '',
      listOfSubjects: [],
      currentSubject: 0,
      checked: 0
    };

    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    
    this.onSignIn = this.onSignIn.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.logout = this.logout.bind(this);
    this.nextModel = this.nextModel.bind(this);
    this.onSceneMount = this.onSceneMount.bind(this);
    this.displayModel = this.displayModel.bind(this);
    this.checkIfCoordIsValid = this.checkIfCoordIsValid.bind(this);
    this.prevModel = this.prevModel.bind(this);
    this.pullData = this.pullData.bind(this);
    this.initializeSubjectList = this.initializeSubjectList.bind(this);
  }

  pullData() {
    const {modelNum, currentSubject, listOfSubjects} = this.state;
    console.log(listOfSubjects)
    fetch('/api/generate?id=' + (modelNum)+'&subjectID=' + (listOfSubjects[currentSubject]))
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          this.displayModel(json.points[0], json.imgDisp);
        } else {
          console.log(json)
        }
      });
  }

  prevModel() {
    const {_canvas, _scene, modelNum, _camera } = this.state;
    if (modelNum == 0) return;
    for (var i = 0; i < _scene.meshes.length; i++) {
      _scene.meshes[i].dispose();
      i--;
    }
    this.setState({modelNum: modelNum - 1});
    this.pullData();
    
  }
  
  onChange(i){
     this.setState({
         checked:index
     });
  }

  nextModel() {
    const {_canvas, _scene, modelNum, _camera } = this.state;
    for (var i = 0; i < _scene.meshes.length; i++) {
      _scene.meshes[i].dispose();
      i--;
    }
    this.setState({modelNum: modelNum + 1});
    this.pullData();
    
  }
  
  checkIfCoordIsValid(arr) {
    return !(arr[0] == 0 && arr[1] == 0 && arr[2] == 0);
  }

  initializeSubjectList() {
    fetch('/api/getsubjects')
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          for (var subjectID of json.subjects) {
            console.log(subjectID)
            this.setState({listOfSubjects: this.state.listOfSubjects.concat([subjectID])});
            this.pullData();
          }
        } else {
          console.log(json, 'subjectlist')
        }
      });
  }

  displayModel(keypointsArray, imageData) {
    console.log(keypointsArray)
    let jointMapping = {0:[15, 16, 1], 1:[5, 2], 2:[3], 5:[6], 6:[7], 3:[4], 16:[18], 15:[17]}
    let keypointMapping = {0: "Nose", 1: "Neck", 2: "RShoulder", 3: "RElbow", 4: "RWrist", 5: "LShoulder", 6: "LElbow", 7: "LWrist", 8: "MidHip",  9: "RHip", 10: "RKnee", 11: "RAnkle", 12: "LHip", 13: "LKnee", 14: "LAnkle", 15: "REye", 16: "LEye", 17: "REar", 18: "LEar", 19: "LBigToe", 20: "LSmallToe", 21: "LHeel", 22: "RBigToe", 23: "RSmallToe", 24: "RHeel"}
    const { _canvas, _scene, _camera } = this.state;
    this.setState({currImg: imageData});
    for (var key in keypointsArray) {
      if (key == "id" || key == "_id" || 
         (keypointsArray[key][0] == 0 && keypointsArray[key][1] == 0 && 
          keypointsArray[key][2] == 0)) continue;
      var jointSphere = BABYLON.MeshBuilder.CreateSphere(key, {diameter: .1}, _scene);
      jointSphere.position.x = keypointsArray[key][1] * 1.5;
      jointSphere.position.y = keypointsArray[key][2] * 1.5;
      jointSphere.position.z = keypointsArray[key][0] * 1.5;
  

    }
    for (var key in jointMapping) {
      if (this.checkIfCoordIsValid(keypointsArray[keypointMapping[key]])) {
        var currentJointLoc = keypointsArray[keypointMapping[key]]
        var jointsThisConnectsTo = jointMapping[key];
        for (var jointNum of jointsThisConnectsTo) {
          var jointName = keypointMapping[jointNum];
          if (this.checkIfCoordIsValid(keypointsArray[jointName])) {
            var jointLoc = keypointsArray[jointName];
            var myPath = [
              new BABYLON.Vector3(currentJointLoc[1] * 1.5, currentJointLoc[2] * 1.5, currentJointLoc[0] * 1.5),
              new BABYLON.Vector3(jointLoc[1] * 1.5, jointLoc[2] * 1.5, jointLoc[0] * 1.5),
            ];
            var tubemat = new BABYLON.StandardMaterial("tubemat", _scene);
            tubemat.diffuseColor = new BABYLON.Color3(1.0, 0.0, 0.0);
            var tube = BABYLON.MeshBuilder.CreateTube("tube", {path: myPath, radius: 0.02, sideOrientation: BABYLON.Mesh.DOUBLESIDE, updatable: true}, _scene);
            tube.material = tubemat;
          }
        }
      }
    }
  }

  onSceneMount(e) {
    const { canvas, scene } = e;
    
    const { modelNum } = this.state;
  //scene.clearColor = BABYLON.Color3.Black;
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(0, 0, 5));
    camera.attachControl(canvas, true);
    camera.alpha = -1.4590458871367977;
    camera.beta = 3.141592653589793;
    this.setState({_canvas : canvas, _scene : scene, _camera : camera});
    var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 0, 0), scene);
    light.intensity = 0.85;
    light.specular = new BABYLON.Color3(0.95, 0.95, 0.81);

    var pl = new BABYLON.PointLight("pl", new BABYLON.Vector3(0, 0, 0), scene);
    pl.diffuse = new BABYLON.Color3(1, 1, 1);
    pl.intensity = 1.0;
    this.initializeSubjectList();
    
    scene.getEngine().runRenderLoop(() => {
        if (scene) {

            scene.render();
        }
    });
  }
  componentWillMount() {
    this.canvas = null
    this.scene = null
  }
  componentDidMount() {
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      signUpEmail,
      signUpPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;

    this.setState({
      isLoading: true,
    });

    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        if (json.success) {
          setInStorage('the_main_app', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('the_main_app');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  render() {
    const {
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
    } = this.state;

    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }

    if (!token) {
      return (
        <div>
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <button onClick={this.onSignIn}>Sign In</button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }
            <p>Sign Up</p>
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <button onClick={this.onSignUp}>Sign Up</button>
          </div>

        </div>
      );
    }

    return (
      <div>
        <Grid>
          <Row className="show-grid">
            <Col md={6} mdPush={6}>
              <Scene width="600" height="400"
                onMeshPicked={this.onMeshPicked}
                onSceneMount={this.onSceneMount}
              />
            </Col>
            <Col md={6} mdPull={6}>
              <img src={this.state.currImg} width="600px" height="400px"/>
            </Col>
          </Row>
          <Row className="show-grid">
              <Button onClick={this.prevModel}> Prev </Button>
              <Button onClick={this.nextModel}> Next </Button>
          </Row>
        </Grid>
          <Button onClick={this.logout}>Logout</Button>
          {
            this.state.listOfSubjects.map((option,i)=>{
              return <label key={i}>
                <input 
                    type="radio"
                    checked={this.state.checked == i? true: false} 
                    onChange={this.onChange.bind(this,i)} 
                    key={i+100}
                    value={i} />
                    {option}
                </label>
            })
          }
      </div>

    );
  }
}

export default Home;
