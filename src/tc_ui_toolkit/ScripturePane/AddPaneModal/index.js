import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { FormControl } from 'react-bootstrap';

import './AddPaneModal.styles.css';
import { IoMdRemoveCircle } from 'react-icons/io'

const styles = {
  toolBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'var(--reverse-color)',
    backgroundColor: 'var(--accent-color-dark)',
    padding: '15px',
    width: '100%',
  },
  title: {
    marginLeft: 'auto',
    fontSize: '22px',
    fontWeight: '400',
  },
  closeButton: { marginLeft: 'auto' },
  dialogContent: {
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    padding: '0px 24px 24px',
    margin: '0px',
  },
  dialogActions: {
    height: '70px',
    padding: '10px',
    margin: '0px',
    borderTop: '1px solid var(--border-color)',
  },

  icon: {
    color: '#ffffff',
    width: 25,
    height: 25,
  },
  iconButton: {
    padding: 0,
    width: 25,
    height: 25,
    marginTop: 5,
  },
  body: { textAlign: 'center' },
  select: {
    margin: '0 auto',
    width: '300px',
  },
};

const AddPaneModal = ({
  show,
  title,
  onHide,
  translate,
  selectLabel,
  selectedPane,
  selectLanguageLabel,
  addNewBibleResource,
  currentPaneSettings,
  selectSourceLanguage,
  getAvailableScripturePaneSelections,
}) => {
  const panes = [];
  const availableResources = [];
  getAvailableScripturePaneSelections(availableResources);

  for (let i = 0, len = availableResources.length; i < len; i++) {
    const resource = availableResources[i];
    const {
      resource_title, language_name, language_id,
    } = resource.manifest;
    let displayText = '';
    let prefix = '';
    const owner = resource.owner || '';

    if (resource.bibleId !== 'targetBible') {
      const languageId = (resource.languageId !== 'originalLanguage') ? resource.languageId : translate('pane.original_language');
      displayText = `${language_name} (${languageId})  (${resource_title})`;

      if (owner) {
        displayText += ` (${owner})`;
      }

      const stage = resource?.manifest?.stage;

      if ((owner !== 'Door43-Catalog') && (stage !== 'prod')) {
        displayText = `[${displayText}] - ${translate('pre_release')}`;
        prefix = '*';
      }
    } else {
      displayText = `${language_name} (${language_id})  (${translate('pane.target_language')}) (${translate('pane.current_project')})`;
    }

    const foundInCurrentPaneSettings = currentPaneSettings.findIndex(
      (paneSetting) => paneSetting.bibleId === resource.bibleId &&
        paneSetting.languageId === resource.languageId &&
        paneSetting.owner === resource.owner) >= 0;

    panes.push(
      <option
        key={`${i}${resource.languageId}_${resource.bibleId}_${owner}`}
        value={`${prefix}${resource.languageId}_${resource.bibleId}_${owner}`}
        disabled={foundInCurrentPaneSettings}
      >
        {displayText}
      </option>,
    );
  }

  const isLoadButtonDisabled = Object.keys(selectedPane).length <= 0;

  return (
    <Dialog open={show} onClose={onHide} fullWidth maxWidth='md'>
      <Toolbar style={styles.toolBar}>
        <div style={styles.title}>
          {title}
        </div>
        <IconButton color="inherit" onClick={onHide} aria-label="Close" style={styles.closeButton}>
          <IoMdRemoveCircle />
        </IconButton>
      </Toolbar>
      <DialogContent style={styles.dialogContent}>
        <h4 style={{ marginBottom: '30px' }}>
          {selectLanguageLabel}
        </h4>
        <FormControl
          componentClass="select"
          style={styles.select}
          onChange={e => selectSourceLanguage(e.target.value)}
        >
          <option value="">{selectLabel}</option>
          {panes}
        </FormControl>
      </DialogContent>
      <DialogActions disableSpacing style={styles.dialogActions}>
        <button className="btn-second" onClick={onHide}>
          {translate('close')}
        </button>
        <button className="btn-prime" onClick={addNewBibleResource} disabled={isLoadButtonDisabled}>
          {translate('load')}
        </button>
      </DialogActions>
    </Dialog>
  );
};

AddPaneModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectLanguageLabel: PropTypes.string.isRequired,
  selectLabel: PropTypes.string.isRequired,
  selectSourceLanguage: PropTypes.func.isRequired,
  selectedPane: PropTypes.shape({
    bibleId: PropTypes.string,
    languageId: PropTypes.string,
  }),
  addNewBibleResource: PropTypes.func.isRequired,
  currentPaneSettings: PropTypes.array.isRequired,
  translate: PropTypes.func.isRequired,
  getAvailableScripturePaneSelections: PropTypes.func.isRequired,
};

export default AddPaneModal;
