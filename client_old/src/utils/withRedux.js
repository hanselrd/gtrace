import { connect } from 'react-redux';
import mapStateToProps from './mapStateToProps';
import mapDispatchToProps from './mapDispatchToProps';

export default Component =>
  connect(mapStateToProps, mapDispatchToProps)(Component);
