function mySettings(props) {
  return (
    <Page>
      <Section
        title={<Text bold align="center">LIFX Settings</Text>}>
        <TextInput
          label="LIFX Token"
          settingsKey="lifxToken"
        />
        <Link source="https://cloud.lifx.com/settings">Get an LIFX token here</Link>
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
