import Popup from "devextreme-react/popup";
import ScrollView from "devextreme-react/scroll-view";
import * as React from "react";
import VoiceRecorder from "./Recorder";
import TextBox from "devextreme-react/text-box";
import SPService from "../services/SPServices";
import { Button } from "devextreme-react/button";
import { Label, RequiredRule, SimpleItem } from "devextreme-react/form";

interface IAddRecordingProps {
  show: boolean;
  spService: SPService;
  libraryInfo: {
    ServerRelativeUrl: string;
  };
  closeModal: () => {};
  refreshData: () => void;
}
const AddRecording = (props: IAddRecordingProps) => {
  const { show, spService, closeModal, refreshData } = props;
  const [to, setTo] = React.useState(null);
  const [recordingBuffer, setRecordingBuffer] = React.useState(null);

  const changeRecordedFile = async (blob) => {
    const arrayBuffer = await new Response(blob).arrayBuffer();
    setRecordingBuffer(arrayBuffer);
  };

  const uploadRecording = () => {
    spService
      .postArrayBufferByServerRelativeUrl(
        recordingBuffer,
        props.libraryInfo.ServerRelativeUrl,
        `${to}.mp3`
      )
      .then(() => {
        closeModal();
        setTo(null);
        setRecordingBuffer(null);
        refreshData();
      });
  };

  return (
    show && (
      <Popup
        width={550}
        height={350}
        visible={true}
        showTitle={false}
        hideOnOutsideClick={true}
      >
        <ScrollView width="100%" height="100%">
          <VoiceRecorder getRecording={changeRecordedFile} />
          <div style={{ fontWeight: "bold" }}>
            Send To: <span style={{ color: "red", fontSize: "medium" }}>*</span>
          </div>

          <TextBox
            showClearButton={false}
            valueChangeEvent="keyup"
            onValueChanged={(data) => {
              setTo(data.value);
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <Button
              width={120}
              text="Add"
              type="default"
              stylingMode="contained"
              disabled={to == null || to == "" || recordingBuffer == null}
              onClick={uploadRecording}
            />
            <Button
              style={{ marginLeft: "1rem" }}
              width={120}
              text="Cancel"
              type="danger"
              stylingMode="contained"
              onClick={closeModal}
            />
          </div>
        </ScrollView>
      </Popup>
    )
  );
};

export default AddRecording;
