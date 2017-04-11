import { ListView } from 'react-native';
import { computed, observable } from 'mobx';

export default class DataSource extends ListView.DataSource {
  rootParent: DataSource;

  @observable rootIsLoading: boolean = false;
  @observable rootError: string  = '';

  cloneWithRowsAndSections(dataBlob, sectionIdentities, rowIdentities) {
    const newDs = super.cloneWithRowsAndSections(
      dataBlob,
      sectionIdentities,
      rowIdentities
    );

    // eslint-disable-next-line no-proto
    newDs.__proto__ = DataSource.prototype;
    newDs.rootParent = this.rootParent || this;

    return newDs;
  }

  @computed get isLoading() {
    const inst = this.rootParent || this;
    return inst.rootIsLoading;
  }

  set isLoading(value) {
    const inst = this.rootParent || this;
    inst.rootIsLoading = value;
  }

  @computed get error() {
    const inst = this.rootParent || this;
    return inst.rootError;
  }

  set error(value) {
    const inst = this.rootParent || this;
    inst.rootError = value;
  }

  @computed get isError() {
    const inst = this.rootParent || this;
    return inst.rootError !== '';
  }
}