import { extendObservable } from 'mobx';

import omit from 'lodash/omit';

function makeObs(model, fields, excludedFields) {
  const obsFields = excludedFields ? omit(fields, excludedFields) : fields;
  extendObservable(model, obsFields);
}

export default makeObs;
