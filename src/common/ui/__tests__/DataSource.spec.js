import DataSource from '../DataSource';

describe('ui.DataSource', () => {
  it('should keep the same value for all cloned instances', () => {
    const ds = new DataSource({ rowHasChanged: () => {} });
    ds.error = 'Test 1';

    const ds2 = ds.cloneWithRows([]);
    expect(ds2.error).toEqual('Test 1');

    ds2.error = 'Test 2';
    expect(ds2.error).toEqual('Test 2');
    expect(ds.error).toEqual('Test 2');
  });
});