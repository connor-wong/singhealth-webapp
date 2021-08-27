import React, { Component } from "react";
import "../../../App.css";
import { NavLink } from "react-router-dom";
import app from "../../../services/firebase";
import UploadLogo from "../../../images/upload.png";

import ProfessionalismQuestions from "./ProfessionalismQuestions";
import {
  StaffHygieneQuestionsPartOne,
  StaffHygieneQuestionsPartTwo,
} from "../F&B/StaffHygieneQuestions";
import {
  GeneralEnvironmentalCleanlinessPartOne,
  GeneralEnvironmentalCleanlinessPartTwo,
  GeneralEnvironmentalCleanlinessPartThree,
} from "./GeneralEnvironmentalCleaninessQuestions";
import HandHygieneFacilitiesQuestions from "./HandHygieneFacilitiesQuestions";
import {
  StoragePreparationOfFoodQuestionsPartOne,
  StoragePreparationOfFoodQuestionsPartTwo,
  StoragePreparationOfFoodQuestionsPartThree,
  StoragePreparationOfFoodQuestionsPartFour,
} from "./StoragePreparationOfFoodQuestions";
import {
  StorageOfFoodInRefrigeratorWarmerQuestionsPartOne,
  StorageOfFoodInRefrigeratorWarmerQuestionsPartTwo,
} from "./StorageOfFoodInRefrigeratorWarmerQuestions";
import FoodQuestions from "./FoodQuestions";
import BeverageQuestions from "./BeverageQuestions";
import {
  GeneralSafetyQuestionsPartOne,
  GeneralSafetyQuestionsPartTwo,
} from "./GeneralSafetyQuestions";
import FireEmergencySafetyQuestions from "./FireEmergencySafetyQuestions";
import ElectricalSafetyQuestions from "./ElectricalSafetyQuestions";
import Result from "../../selections-dev/Result";
import Comments from "../../selections-dev/Comments";

import {
  Container,
  Row,
  Col,
  Image,
  Modal,
  Button,
  Spinner,
} from "react-bootstrap";

/* Update questions value, score & timestamp */
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedChoices: this.props.editData,
      checkListPage: 1,
      images: [],
      imageURLs: [],
      deleteImageURLs: [],
      previewImage: [],
      enlargeImage: false,
      selectedImage: null,
      isLoading: true,
      _isMounted: false,
    };
    this.onSelectChoice = this.onSelectChoice.bind(this);
  }

  transmitData = () => {
    let data = JSON.parse(localStorage.getItem("EditData"));

    /* Part One: Professionalism & Staff Hygiene 10% */
    var partOneQuestions = 13;
    var partOnePassScore = 0;
    for (var partOne = 0; partOne < 13; partOne++) {
      switch (data[partOne].value) {
        case "Not Applicable":
          partOneQuestions = partOneQuestions - 1;
          break;
        case "Pass":
          partOnePassScore = partOnePassScore + 1;
          break;
        case "Fail":
          break;
        default:
          return;
      }
    }

    /* Part Two: Housekeeping & General Cleanliness 20% */
    var partTwoQuestions = 17;
    var partTwoPassScore = 0;
    for (var partTwo = 13; partTwo < 30; partTwo++) {
      switch (data[partTwo].value) {
        case "Not Applicable":
          partTwoQuestions = partTwoQuestions - 1;
          break;
        case "Pass":
          partTwoPassScore = partTwoPassScore + 1;
          break;
        case "Fail":
          break;
        default:
          return;
      }
    }

    /* Part Three: Food Hygiene 35% */
    var partThreeQuestions = 37;
    var partThreePassScore = 0;
    for (var partThree = 30; partThree < 67; partThree++) {
      switch (data[partThree].value) {
        case "Not Applicable":
          partThreeQuestions = partThreeQuestions - 1;
          break;
        case "Pass":
          partThreePassScore = partThreePassScore + 1;
          break;
        case "Fail":
          break;
        default:
          return;
      }
    }

    /* Part Four: Health Choice 15% */
    var partFourQuestions = 11;
    var partFourPassScore = 0;
    for (var partFour = 67; partFour < 78; partFour++) {
      switch (data[partFour].value) {
        case "Not Applicable":
          partFourQuestions = partFourQuestions - 1;
          break;
        case "Pass":
          partFourPassScore = partFourPassScore + 1;
          break;
        case "Fail":
          break;
        default:
          return;
      }
    }

    /* Part Five: Workplace Safety & Health 20% */
    var partFiveQuestions = 18;
    var partFivePassScore = 0;
    for (var partFive = 78; partFive < 96; partFive++) {
      switch (data[partFive].value) {
        case "Not Applicable":
          partFiveQuestions = partFiveQuestions - 1;
          break;
        case "Pass":
          partFivePassScore = partFivePassScore + 1;
          break;
        case "Fail":
          break;
        default:
          return;
      }
    }

    /* Score Calculation */
    var Part_One_Score = (partOnePassScore / partOneQuestions) * 10;
    var Part_Two_Score = (partTwoPassScore / partTwoQuestions) * 20;
    var Part_Three_Score = (partThreePassScore / partThreeQuestions) * 35;
    var Part_Four_Score = (partFourPassScore / partFourQuestions) * 15;
    var Part_Five_Score = (partFivePassScore / partFiveQuestions) * 20;
    var Total_Score =
      Part_One_Score +
      Part_Two_Score +
      Part_Three_Score +
      Part_Four_Score +
      Part_Five_Score;

    /* Round Off */
    Part_One_Score = Part_One_Score.toFixed(1);
    Part_Two_Score = Part_Two_Score.toFixed(1);
    Part_Three_Score = Part_Three_Score.toFixed(1);
    Part_Four_Score = Part_Four_Score.toFixed(1);
    Part_Five_Score = Part_Five_Score.toFixed(1);
    Total_Score = Total_Score.toFixed(1);

    /* Local Storage */
    localStorage.setItem("Part One Score", Part_One_Score);
    localStorage.setItem("Part Two Score", Part_Two_Score);
    localStorage.setItem("Part Three Score", Part_Three_Score);
    localStorage.setItem("Part Four Score", Part_Four_Score);
    localStorage.setItem("Part Five Score", Part_Five_Score);
    localStorage.setItem("Total Score", Total_Score);

    /* Data Formation */
    let Data = localStorage.getItem("EditData");
    let Institution = localStorage.getItem("Institution");
    let Comments = localStorage.getItem("Comments");

    /* Store Updated Data To Firebase */
    const db = app.firestore();
    db.collection(Institution).doc(this.props.doc_id).update({
      Total_Score,
      Part_One_Score,
      Part_Two_Score,
      Part_Three_Score,
      Part_Four_Score,
      Part_Five_Score,
      Data,
      Comments,
      created: new Date(),
    });

    /* Delete images from storage */
    let deleteImages = this.state.deleteImageURLs;

    const deleteStorage = app.storage();
    deleteImages.map((image) => {
      deleteStorage.refFromURL(image).delete();
    });

    /* Upload new images to storage */
    let newImages = this.state.images;

    const storage = app.storage().ref(this.props.doc_id);
    newImages.map((image) => {
      storage.child(image.name).put(image);
    });

    this.setState({
      checkListPage: this.state.checkListPage + 1,
    });
    //console.log("Data Updated!");
  };

  onSelectChoice(e) {
    const selectedChoices = [...this.state.selectedChoices];
    const choice = selectedChoices.find((x) => x.id === e.target.id);
    if (choice) choice.value = e.target.value;
    else selectedChoices.push({ id: e.target.id, value: e.target.value });
    this.setState(
      {
        selectedChoices,
      },
      () => {
        //console.log(this.state.selectedChoices);
      }
    );
  }

  retrieveImageHandler = () => {
    let imageURLs = [];
    const storage = app.storage().ref();

    storage
      .child(this.props.doc_id)
      .listAll()
      .then((result) => {
        result.items.forEach((imageRef) => {
          imageRef.getDownloadURL().then((url) => {
            imageURLs.push(url);
            this.setState({ imageURLs, previewImage: imageURLs });
          });
        });
      });
  };

  imageUploadHandler = (e) => {
    let images = [...this.state.images];
    images.push(...e.target.files);
    this.setState({ images });

    const filesArray = Array.from(images).map((file) =>
      URL.createObjectURL(file)
    );

    let previewImage = [...this.state.imageURLs, ...filesArray];
    this.setState({ previewImage });
  };

  deleteHandler = () => {
    let prevImage = this.state.previewImage;
    let images = this.state.images;
    let deleteImageURLs = this.state.deleteImageURLs;

    const index = prevImage.indexOf(this.state.selectedImage);

    if (this.state.selectedImage.includes("firebase")) {
      deleteImageURLs.push(this.state.selectedImage);
      if (index > -1) {
        prevImage.splice(index, 1);
      }
    } else {
      if (index > -1) {
        prevImage.splice(index, 1);
        images.splice(this.state.previewImage.length - index, 1);
      }
    }

    this.setState({ prevImage, deleteImageURLs, enlargeImage: false });
  };

  componentDidMount() {
    this.setState({ _isMounted: true });
    this.retrieveImageHandler();
  }

  componentWillUnmount() {
    this.setState({ _isMounted: false });
  }

  render() {
    localStorage.setItem(
      "EditData",
      JSON.stringify(this.state.selectedChoices)
    );
    return (
      <div>
        {this.state.isLoading == true ? (
          <>
            {setTimeout(() => {
              this.setState({ isLoading: false });
            }, 1500)}
            <Container className="text-center spinner" fluid>
              <Row>
                <Col>
                  <Spinner
                    className="loader"
                    animation="border"
                    style={{ width: "5rem", height: "5rem" }}
                  />
                  <h3>Loading...</h3>
                </Col>
              </Row>
            </Container>
          </>
        ) : (
          <>
            <Container className="text-center Checklist" fluid>
              <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12} className="header">
                  <h3>
                    {this.props.retailName} @ {this.props.selectedInstitution}
                  </h3>
                </Col>
              </Row>

              <Row className="questions">
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  {this.state.checkListPage === 1 && (
                    <ProfessionalismQuestions
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 2 && (
                    <StaffHygieneQuestionsPartOne
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 3 && (
                    <StaffHygieneQuestionsPartTwo
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 4 && (
                    <GeneralEnvironmentalCleanlinessPartOne
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 5 && (
                    <GeneralEnvironmentalCleanlinessPartTwo
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 6 && (
                    <GeneralEnvironmentalCleanlinessPartThree
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 7 && (
                    <HandHygieneFacilitiesQuestions
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 8 && (
                    <StoragePreparationOfFoodQuestionsPartOne
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 9 && (
                    <StoragePreparationOfFoodQuestionsPartTwo
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 10 && (
                    <StoragePreparationOfFoodQuestionsPartThree
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 11 && (
                    <StoragePreparationOfFoodQuestionsPartFour
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 12 && (
                    <StorageOfFoodInRefrigeratorWarmerQuestionsPartOne
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 13 && (
                    <StorageOfFoodInRefrigeratorWarmerQuestionsPartTwo
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 14 && (
                    <FoodQuestions
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 15 && (
                    <BeverageQuestions
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 16 && (
                    <GeneralSafetyQuestionsPartOne
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 17 && (
                    <GeneralSafetyQuestionsPartTwo
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 18 && (
                    <FireEmergencySafetyQuestions
                      choiceSelect={this.onSelectChoice}
                      selectedOption={this.props.selectedOption}
                    />
                  )}
                  {this.state.checkListPage === 19 && (
                    <div>
                      <ElectricalSafetyQuestions
                        choiceSelect={this.onSelectChoice}
                        selectedOption={this.props.selectedOption}
                      />
                    </div>
                  )}
                  {this.state.checkListPage === 20 && (
                    <div>
                      <Comments />
                      <div className="submit-data-button">
                        <input
                          type="button"
                          name=""
                          value="< Edit Audit >"
                          onClick={this.transmitData}
                        />
                      </div>
                    </div>
                  )}
                  {this.state.checkListPage === 21 && (
                    <div>
                      <Result />
                      <div className="result-home-button">
                        <NavLink to="/home">
                          <input
                            type="button"
                            name=""
                            value="<BACK TO HOMEPAGE"
                          />
                        </NavLink>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>

              <Row>
                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                  {this.state.checkListPage > 1 &&
                    this.state.checkListPage < 21 && (
                      <div className="question-previouspage">
                        <input
                          type="button"
                          name=""
                          value="< PREVIOUS PAGE"
                          onClick={() => {
                            this.setState({
                              checkListPage: this.state.checkListPage - 1,
                            });
                          }}
                        />
                      </div>
                    )}
                </Col>
                <Col xl={6} lg={6} md={6} sm={6} xs={6}>
                  {this.state.checkListPage < 20 && (
                    <div className="question-nextpage">
                      <input
                        type="button"
                        name=""
                        value="NEXT PAGE >"
                        onClick={() => {
                          this.setState({
                            checkListPage: this.state.checkListPage + 1,
                          });
                        }}
                      />
                    </div>
                  )}
                </Col>
              </Row>

              {this.state.checkListPage < 20 && (
                <>
                  <Row className="image-upload">
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={this.imageUploadHandler}
                        multiple
                      />
                      <label htmlFor="image">
                        <Image
                          className="upload-logo"
                          src={UploadLogo}
                          alt=""
                          style={{
                            width: "calc(1.5rem + 1vw)",
                            height: "auto",
                            marginRight: "10px",
                          }}
                        />
                        Upload Images
                      </label>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      {this.state.previewImage.map((photo) => {
                        return (
                          <React.Fragment key={photo}>
                            <Image
                              src={photo}
                              id={photo}
                              alt=""
                              style={{
                                width: "calc(2rem + 1vw)",
                                height: "calc(2rem + 1vw)",
                                marginRight: "2px",
                              }}
                              rounded
                              onClick={() =>
                                this.setState({
                                  enlargeImage: true,
                                  selectedImage: photo,
                                })
                              }
                            />
                          </React.Fragment>
                        );
                      })}
                    </Col>
                  </Row>

                  <Modal
                    show={this.state.enlargeImage}
                    onHide={() => this.setState({ enlargeImage: false })}
                    centered
                  >
                    <Modal.Body>
                      <Image
                        alt=""
                        src={this.state.selectedImage}
                        rounded
                        style={{
                          width: "100%",
                          height: "auto",
                        }}
                      />
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => this.setState({ enlargeImage: false })}
                      >
                        Close
                      </Button>
                      <Button variant="primary" onClick={this.deleteHandler}>
                        Remove
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </>
              )}
            </Container>
          </>
        )}
      </div>
    );
  }
}

export default Edit;
