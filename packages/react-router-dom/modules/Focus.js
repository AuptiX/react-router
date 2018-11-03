import React from "react";
import { __RouterContext as RouterContext } from "react-router";
import warning from "tiny-warning";
import PropTypes from "prop-types";
import { locationsAreEqual } from "history";

class FocusWithLocation extends React.Component {
  setRef = element => {
    this.eleToFocus = element;
  };

  componentDidMount() {
    this.focus();
  }

  componentDidUpdate(prevProps) {
    // only re-focus when the location changes
    if (!locationsAreEqual(this.props.location, prevProps.location)) {
      this.focus();
    }
  }

  focus() {
    const { preserve, preventScroll } = this.props;
    // https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex#managing_focus_at_the_page_level
    if (this.eleToFocus != null) {
      warning(
        this.eleToFocus.hasAttribute("tabIndex") ||
          this.eleToFocus.tabIndex !== -1,
        'The ref must be assigned an element with the "tabIndex" attribute or be focusable by default in order to be focused. ' +
          "Otherwise, the document's <body> will be focused instead."
      );

      if (preserve && this.eleToFocus.contains(document.activeElement)) {
        return;
      }

      setTimeout(() => {
        this.eleToFocus.focus({ preventScroll });
      });
    } else {
      warning(
        false,
        "There is no element to focus. Did you forget to add the ref to an element?"
      );
    }
  }

  render() {
    const { children } = this.props;
    return children(this.setRef);
  }
}

const Focus = props => (
  <RouterContext.Consumer>
    {context => <FocusWithLocation location={context.location} {...props} />}
  </RouterContext.Consumer>
);

Focus.defaultProps = {
  preventScroll: false
};

if (__DEV__) {
  Focus.propTypes = {
    preventScroll: PropTypes.bool,
    preserve: PropTypes.bool,
    children: PropTypes.func
  };
}

export default Focus;