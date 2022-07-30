import * as React from "react";
import { IDataGridProps } from "./IDataGridProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import data from "./testData.json";
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
  Grouping,
  ColumnChooser,
  LoadPanel,
  Toolbar,
  Item,
} from "devextreme-react/data-grid";
import { Button } from "devextreme-react/button";
import AddRecording from "./AddRecording";
import SPService from "../services/SPServices";

export interface ISampleGridState {
  showAddRecording: boolean;
  data: any;
  libraryInfo: {
    ServerRelativeUrl: string;
  };
}

const pageSizes = [10, 25, 50, 100];
export default class SampleGrid extends React.Component<
  IDataGridProps,
  ISampleGridState
> {
  public spService = new SPService(this.props.context);
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss(
      "https://cdn3.devexpress.com/jslib/22.1.3/css/dx.common.css"
    );

    SPComponentLoader.loadCss(
      "https://cdn3.devexpress.com/jslib/22.1.3/css/dx.material.blue.light.css"
    );

    this.state = {
      showAddRecording: false,
      data: null,
      libraryInfo: null,
    };
  }

  componentDidMount() {
    this.spService.getLibraryInformationByName("Recordings").then((res) => {
      this.setState({
        libraryInfo: res.value[0],
      });
      this.spService
        .getAllFiles(res.value[0].ServerRelativeUrl)
        .then((response) => {
          this.setState({
            data: response.value,
          });
        });
    });
  }

  getRecordings = () => {
    this.spService
      .getAllFiles(this.state.libraryInfo.ServerRelativeUrl)
      .then((response) => {
        this.setState({
          data: response.value,
        });
      });
  };

  public render(): React.ReactElement<IDataGridProps> {
    return (
      <section>
        <AddRecording
          show={this.state.showAddRecording}
          spService={this.spService}
          libraryInfo={this.state.libraryInfo}
          closeModal={(): any => {
            this.setState({
              showAddRecording: false,
            });
          }}
          refreshData={this.getRecordings}
        />
        <DataGrid
          dataSource={this.state.data}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
        >
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Toolbar>
            <Item>
              <Button
                width={120}
                text="Add Recording"
                type="default"
                stylingMode="contained"
                onClick={() => {
                  this.setState({
                    showAddRecording: true,
                  });
                }}
              />
            </Item>
          </Toolbar>
          <Column dataField="Name" caption="Name" />
          <Column
            dataField="ListItemAllFields.Created"
            caption="Created"
            cellRender={(props) => {
              return new Date(
                props.data.ListItemAllFields.Created
              ).toLocaleDateString();
            }}
          />
          <Column
            cellRender={(props) => {
              return (
                <Button
                  width={120}
                  text="Play"
                  type="default"
                  stylingMode="contained"
                  onClick={() => {
                    window.open(
                      `${window.location.origin}/${this.state.libraryInfo.ServerRelativeUrl}/${props.data.Name}?web=1`,
                      "_blank"
                    );
                  }}
                />
              );
            }}
          />
          <Pager
            allowedPageSizes={pageSizes}
            showPageSizeSelector={true}
            showNavigationButtons
          />
          <Paging defaultPageSize={10} />
        </DataGrid>
      </section>
    );
  }
}
