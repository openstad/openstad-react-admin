import React from 'react';
import { Edit, SelectInput, TextInput, TabbedForm,
  FormTab,
  BooleanInput,
  NumberInput,
  Toolbar,
  SaveButton,
  ArrayInput,
  SimpleFormIterator
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';
import JsonInput from '../../form-fields/JsonInput.jsx';
import SettingsIcon from '@material-ui/icons/Settings';

export const SiteIcon = SettingsIcon;

const SaveToolbar = props => (
    <Toolbar {...props} >
      <SaveButton />
    </Toolbar>
);


const useStyles = makeStyles(theme => ({
  root: {
    paddingTop: 40,
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '1em',
  },
  form: {
    [theme.breakpoints.up('xs')]: {
      width: 400,
    },
    [theme.breakpoints.down('xs')]: {
      width: '100vw',
      marginTop: -30,
    },
  },
  inlineField: {
    display: 'inline-block',
    width: '50%',
  },
}));

let currentAutomaticallyUpdateStatusIsActiveValue;
const AutomaticallyUpdateStatusInput = ({source, record}) => {

  const [value, setValue] = React.useState('toggleIsActive');

  if (typeof currentAutomaticallyUpdateStatusIsActiveValue === 'undefined') {
    currentAutomaticallyUpdateStatusIsActiveValue = record.config.ideas.automaticallyUpdateStatus && record.config.ideas.automaticallyUpdateStatus.isActive || false;
  }

  const handleChange = value=> {
    currentAutomaticallyUpdateStatusIsActiveValue = value;
    setValue(value); // force update
  };
  
  let afterXDaysHTML = null;
  if (currentAutomaticallyUpdateStatusIsActiveValue) {
    afterXDaysHTML = (
      <div fullWidth style={{'font-size': 'small', 'font-weight': 'normal'}}>
        <NumberInput source="config.ideas.automaticallyUpdateStatus.afterXDays" label="Number of days after which the status is updated" fullWidth initialValue="90" variant="outlined"/>
      </div>
    );

  }
  
  return (
    <div fullWidth>
      {/* Het wordt tijd voor een taal switch... */}
      <BooleanInput source="config.ideas.automaticallyUpdateStatus.isActive" label="Automatically update status from OPEN to CLOSED when an idea is a given number of days old" fullWidth initialValue={false} variant="outlined" onChange={handleChange}/>
      {afterXDaysHTML}
    </div>
  );
}


export const SiteEdit = (props) => {
  console.log('SiteEdit init');
  //          {values.config && values.config.votes && values.config.votes.voteType === 'budgeting-per-theme' && <div>
  // const { values } = useFormState();

  return (<Edit mutationMode="pessimistic" title="Edit site" {...props}>
      <TabbedForm redirect="edit" toolbar={<SaveToolbar />}>
        <FormTab label="Info" >
          <TextInput disabled source="id" fullWidth variant="outlined" />
          <TextInput source="title" fullWidth variant="outlined" />
          {/* Het wordt tijd voor een taal switch... */}
          <div fullWidth>Setting the 'Project has ended' parameter will automatically update 'Can add new ideas', 'Votes are active', etc.</div>
          <BooleanInput source="config.projectHasEnded" label="Project has ended" fullWidth initialValue={false} variant="outlined" />
        </FormTab>
        <FormTab label="Ideas">
          <BooleanInput source="config.ideas.canAddNewIdeas" label="Possible to send in ideas?" fullWidth initialValue={true}  variant="outlined" />
          <NumberInput source="config.ideas.minimumYesVotes" label="Minimum votes needed for idea?" fullWidth initialValue="100"variant="outlined"  />
          <NumberInput source="config.ideas.titleMinLength" label="Minimum length of title" fullWidth initialValue="10" variant="outlined" />
          <NumberInput source="config.ideas.titleMaxLength" label="Maximum length of title" fullWidth initialValue="55" variant="outlined"  />
          <NumberInput source="config.ideas.summaryMinLength" label="Minimum length of summary" fullWidth initialValue="20" variant="outlined"  />
          <NumberInput source="config.ideas.summaryMaxLength" label="Maximum length of summary" fullWidth initialValue="140" variant="outlined"  />
          <NumberInput source="config.ideas.descriptionMinLength" label="Minimum length of description" fullWidth initialValue="140" variant="outlined"  />
          <NumberInput source="config.ideas.descriptionMaxLength" label="Maximum length of description" fullWidth initialValue="5000" variant="outlined" />
          <AutomaticallyUpdateStatusInput source="config.ideas.automaticallyUpdateStatus"/>
        </FormTab>
        {/*
        * Currently only used by ideas-on-map component and editable in the CMS
        * The reactions component should replace the current widgets and then these params can be added here
        <FormTab label="Arguments">
          <BooleanInput source="config.arguments.isClosed" label="Adding of arguments is closed?" fullWidth initialValue={false} variant="outlined" />
          <TextInput source="config.arguments.closedText" label="Text to show when arguments are closed" variant="outlined"/>
          <NumberInput source="config.arguments.descriptionMinLength" label="Minimum length of description" fullWidth initialValue="30" variant="outlined"  />
          <NumberInput source="config.arguments.descriptionMaxLength" label="Maximum length of description" fullWidth initialValue="500" variant="outlined" />
        </FormTab>
        */}
        <FormTab label="Voting">
          <BooleanInput source="config.votes.isViewable" label="Is the vote count publicly available?" fullWidth variant="outlined" />
          <BooleanInput source="config.votes.isActive" label="Is voting active?" fullWidth variant="outlined"  />
          <SelectInput
            source="config.votes.withExisting"
            label="Should voting again replace previous vote? Or give an error?"
            fullWidth
            variant="outlined"
            choices={[
              { id: 'error', name: 'Error' },
              { id: 'replace', name: 'Replace the vote' },
            ]}
          />
          <SelectInput
            source="config.votes.voteType"
            label="What type of voting is available?"
            fullWidth
            variant="outlined"
            choices={[
              {
                id: 'likes',
                name: 'Likes'
              },
              {
                id: 'count',
                name: 'Count'
              },
              {
                id: 'budgeting',
                name: 'Budgeting'
              },
              {
                id: 'count-per-theme',
                name: 'Count per theme '
              },
              {
                id: 'budgeting-per-theme',
                name: 'Budgeting per theme'
              },
            ]}
          />

          <NumberInput source="config.votes.maxIdeas" label='What is max amount of ideas users can vote for?' fullWidth variant="outlined" />
          <NumberInput source="config.votes.minIdeas" label='What is min amount of ideas users can vote for?' fullWidth variant="outlined" />
          <NumberInput source="config.votes.minBudget" label='What is min budget users can vote for?' fullWidth variant="outlined" />
          <NumberInput source="config.votes.maxBudget" label='What is max budget users can vote for?' fullWidth variant="outlined" />
          <ArrayInput label="Themes configuration for budget voting" source="config.votes.themes">
            <SimpleFormIterator>
              <TextInput label="Name of theme" source="value" />
              <NumberInput label="Minimum ideas to vote for, (for theme)" source="minIdeas" />
              <NumberInput label="Maximum ideas to vote for (for theme)" source="maxIdeas" />
              <NumberInput label="Min budget (for theme)" source="minBudget" />
              <NumberInput label="Max budget (for theme)" source="maxBudget" />
            </SimpleFormIterator>
          </ArrayInput>

        </FormTab>
        <FormTab label="Notifications">
          <h4>Where to send adminstrator notifications?</h4>
          <TextInput label="Email To" source="config.notifications.to" variant="outlined" />
          <TextInput label="Email Address" source="config.notifications.from" variant="outlined" />
        </FormTab>
        <FormTab label="Password Protection">
          <BooleanInput source="config.basicAuth.active" label="Is active?" fullWidth variant="outlined" />
          <TextInput label="User" source="config.basicAuth.user" variant="outlined" />
          <TextInput label="Password" source="config.basicAuth.password" variant="outlined"  />
        </FormTab>
        <FormTab label="Advanced">
          <TextInput disabled source="id" />
          <JsonInput source="config" />
        </FormTab>
      </TabbedForm>
    </Edit>
  )
};
