import * as React from 'react';
import { Button, Form, Header, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const Settings: React.SFC = () => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.settings}</Header>
      <Form inverted>
        <Form.Checkbox label={`${locale.show} ${locale.dob.toLowerCase()}`} />
        <Form.Checkbox label={`${locale.show} ${locale.email.toLowerCase()}`} />
        <Button primary type="submit">
          {locale.saveChanges}
        </Button>
      </Form>
    </Segment>
  </div>
);

export default Settings;
