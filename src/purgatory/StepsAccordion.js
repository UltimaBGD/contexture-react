import _ from 'lodash/fp'
import F from 'futil-js'
import { observer } from 'mobx-react'
import React from 'react'
import { setDisplayName } from 'recompose'
import { Flex } from '../greyVest'
import { withTheme } from '../utils/theme'

// Observes node, so we can activate the Continue button if it (or any child) has a value.
// We don't observe on Step because then it would rerender its children when `node`
// changes, which unfocuses query inputs as soon as the first character is entered.
let Buttons = _.flow(
  setDisplayName('Buttons'),
  observer,
  withTheme
)(
  ({
    step,
    isValid,
    totalSteps,
    setCurrentStep,
    onSubmit,
    hideBackButton,
    theme: { Button, Icon },
  }) => (
    <>
      {!hideBackButton && step > 0 && (
        <Button
          onClick={() => setCurrentStep(step - 1)}
          className="back-button"
        >
          <Icon icon="PreviousPage" />
          Back
        </Button>
      )}
      {step < totalSteps - 1 ? (
        <Button
          primary
          onClick={() => setCurrentStep(step + 1)}
          disabled={!isValid}
        >
          Continue
        </Button>
      ) : (
        <Button primary onClick={onSubmit} disabled={!isValid}>
          View Results
        </Button>
      )}
    </>
  )
)

export let AccordionStep = _.flow(
  setDisplayName('AccordionStep'),
  withTheme
)(
  ({
    style,
    className,
    step,
    totalSteps,
    currentStep,
    setCurrentStep,
    title,
    isRequired = false,
    isValid = true,
    onSubmit,
    children,
    hideBackButton,
    theme: { Icon },
  }) => {
    let open = currentStep === step
    return (
      <div className={`accordion-step ${className || ''}`} style={style}>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setCurrentStep(open ? -1 : step)}
          style={{ cursor: 'pointer' }}
        >
          <Flex alignItems="center">
            <div className="accordion-step-title">
              {F.callOrReturn(title, step)}
            </div>
            {!isRequired && <em style={{ marginLeft: 6 }}>(Optional)</em>}
          </Flex>
          <div className="filter-field-label-icon">
            <Icon icon={open ? 'FilterListCollapse' : 'FilterListExpand'} />
          </div>
        </Flex>
        {open && (
          <>
            <div className="step-contents">{children}</div>
            <Buttons
              {...{
                step,
                totalSteps,
                setCurrentStep,
                onSubmit,
                isValid,
                hideBackButton,
              }}
            />
          </>
        )}
      </div>
    )
  }
)

let useStepState = () => {
  let [state, setState] = React.useState({ current: 0, lastVisible: 0 })
  let update = value =>
    setState({
      current: value,
      lastVisible: _.max([state.lastVisible, value]),
    })
  return [state.current, update, state.lastVisible]
}

let StepsAccordion = ({
  onSubmit = _.noop,
  hideNextSteps = false,
  hideBackButton = false,
  children,
  className,
  ...props
}) => {
  let [currentStep, setCurrentStep, lastVisibleStep] = useStepState()
  let shouldShowStep = i => !hideNextSteps || i <= lastVisibleStep
  return (
    <div className={`steps-accordion ${className || ''}`} {...props}>
      {React.Children.map(
        children,
        (child, i) =>
          shouldShowStep(i) && (
            <child.type
              {...{ currentStep, setCurrentStep, onSubmit }}
              key={i}
              step={i}
              totalSteps={_.size(children)}
              hideBackButton={hideBackButton}
              {...child.props}
            />
          )
      )}
    </div>
  )
}

export default StepsAccordion
