import * as React from "react";
import { IDataGridProps } from "./IDataGridProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import data from "./testData.json";
import DataGrid, {
  Column,
  Pager,
  Paging,
  SearchPanel,
} from "devextreme-react/data-grid";

const pageSizes = [10, 25, 50, 100];
export default class SampleGrid extends React.Component<IDataGridProps, any> {
  constructor(props) {
    super(props);
    SPComponentLoader.loadCss(
      "https://cdn3.devexpress.com/jslib/22.1.3/css/dx.common.css"
    );
    SPComponentLoader.loadCss(
      "https://cdn3.devexpress.com/jslib/22.1.3/css/dx.material.blue.light.css"
    );
  }

  public render(): React.ReactElement<IDataGridProps> {
    return (
      <section>
        <DataGrid
          dataSource={data}
          allowColumnReordering={true}
          rowAlternationEnabled={true}
          showBorders={true}
        >
          <SearchPanel visible={true} highlightCaseSensitive={true} />
          <Column dataField="id" caption="Id" />
          <Column dataField="first_name" caption="First Name" />
          <Column dataField="last_name" caption="Last Name" />
          <Column dataField="email" caption="Email" />
          <Column dataField="gender" caption="Gender" />
          <Column dataField="ip_address" caption="IP Address" />

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
