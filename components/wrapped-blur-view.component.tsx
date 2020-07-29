import React, {Component} from 'react';
import {findNodeHandle, Platform, Dimensions} from 'react-native';
import {BlurView} from '@react-native-community/blur';

const {width: viewportWidth, height: viewportHeight} = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

class WrappedBlurView extends Component<any, any> {
  viewRef: any;
  nodeHandleRef: any;
  constructor(props: any) {
    super(props);
    this.state = {
      // this applies only to android. For ios we can always blur the view, but in android one needs
      // to wait until the view to be blurred is rendered.
      canBlurInAndroid: !isAndroid,
    };
  }

  /*
   * When the view to be blurred changes, we reset the component and start from the beggining.
   */
  componentWillReceiveProps(nextProps: any) {
    if (isAndroid && !nextProps.isLoading) {
      this.viewRef = null;
      this.nodeHandleRef = null;
      this.setState({canBlurInAndroid: false});
    }
  }

  /*
   * Finds the element reference and passes it to the BlurView.
   */
  blur = () => {
    const {showBlur} = this.props as any;
    const {canBlurInAndroid} = this.state as any;
    // if we are not in android.. or if the blur cannot be shown.. or if it is already shown.. we skip..
    if (!isAndroid || !showBlur || canBlurInAndroid) {
      return;
    }

    /*
     * Time out is there to just make sure we run it on the top of the queue.
     * Making the timeout value to 0 should not affect anything.
     */
    setTimeout(() => {
      this.nodeHandleRef = findNodeHandle(this.viewRef);
      this.setState({canBlurInAndroid: true});
    }, 10);
  };

  render() {
    // if we are not blurring, we just retun the children back..
    if (!this.props.showBlur) {
      return this.props.children;
    }

    // children that needs to be blurred.
    const {children, blurAmount} = this.props;

    const {canBlurInAndroid} = this.state;

    // we can accept only one child.
    // If you have mutliple child make sure you render it wrapped inside a `View``
    const isValidChild = React.isValidElement(children);
    if (!isValidChild) {
      console.error('WrappedBlurView expects child to be a single element.');
      return null;
    }

    /* Prepare the style */
    // in android.. we the actual blurred view to be hidden slightly for the blur to be visible properly
    let newStyles = [];
    const myStyleOpactiy = {
      opacity: isAndroid ? 0.3 : 1,
    };

    if ((children! as any).props.style instanceof Array) {
      newStyles = [...(children! as any).props.style, myStyleOpactiy];
    } else {
      if (!(children! as any).props.style) {
        newStyles.push((children! as any).props.style);
      }
      newStyles.push(myStyleOpactiy);
    }
    /* Prepare the style */

    // render the actual element with blur view..
    return (
      <React.Fragment>
        {React.cloneElement(children! as any, {
          ...(children! as any).props,
          ref: (el: any) => {
            if (el && el !== this.viewRef) {
              this.viewRef = el;
              this.blur();
            }
          },
          style: newStyles,
        })}
        {canBlurInAndroid && (
          <BlurView
            blurType="light"
            blurAmount={blurAmount}
            overlayColor="#fffffdb0"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              width: viewportWidth,
              height: viewportHeight,
            }}
            viewRef={this.nodeHandleRef}
          />
        )}
      </React.Fragment>
    );
  }
}

(WrappedBlurView as any).defaultProps = {
  blurAmount: 3,
  showBlur: true,
};

export default WrappedBlurView;
