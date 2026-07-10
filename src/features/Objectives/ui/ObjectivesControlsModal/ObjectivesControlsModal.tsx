import { Modal } from '@/shared/ui/Modal';
import { CircleHelp } from 'lucide-react';
import React from 'react';
import s from './ObjectivesControlsModal.module.css';

type ControlSeparator = 'or' | 'plus' | 'then';

type ControlItem = {
  keys: string[];
  separator?: ControlSeparator;
  description: string;
};

type ControlGroup = {
  title: string;
  items: ControlItem[];
};

type ObjectivesControlsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const controlsGroups: ControlGroup[] = [
  {
    title: 'Build the map',
    items: [
      {
        keys: ['Add Objective', 'Click map'],
        separator: 'then',
        description: 'create a new objective node',
      },
      { keys: ['Drag node'], description: 'move an objective around the map' },
      {
        keys: ['Link dot', 'Drag'],
        separator: 'plus',
        description: 'connect objectives with a dependency line',
      },
    ],
  },
  {
    title: 'Select and edit',
    items: [
      {
        keys: ['Shift', 'Drag map'],
        separator: 'plus',
        description: 'draw a selection box around multiple nodes',
      },
      {
        keys: ['Delete', 'Backspace'],
        separator: 'or',
        description: 'remove selected nodes or connections',
      },
    ],
  },
  {
    title: 'Copy and place',
    items: [
      {
        keys: ['Ctrl', 'C'],
        separator: 'plus',
        description: 'copy selected nodes and their inner connections',
      },
      {
        keys: ['Ctrl', 'V'],
        separator: 'plus',
        description: 'paste the copied group near your cursor',
      },
    ],
  },
  {
    title: 'Navigate',
    items: [
      { keys: ['Mouse wheel'], description: 'zoom in and out' },
      { keys: ['Empty space', 'Drag'], separator: 'plus', description: 'pan around the map' },
      { keys: ['Mini map'], description: 'jump around larger maps quickly' },
    ],
  },
];

const separators: Record<ControlSeparator, string> = {
  or: '/',
  plus: '+',
  then: '>',
};

export const ObjectivesControlsModal = ({ isOpen, onClose }: ObjectivesControlsModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={s.controlsModal}>
        <div className={s.modalHeading}>
          <CircleHelp aria-hidden="true" />
          <div>
            <p>Objectives controls</p>
            <h2>How to work with the map</h2>
          </div>
        </div>

        <div className={s.controlsGrid}>
          {controlsGroups.map((group) => (
            <section className={s.controlsSection} key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={`${group.title}-${item.description}`}>
                    <div className={s.keys}>
                      {item.keys.map((key, index) => (
                        <React.Fragment key={key}>
                          {index > 0 && (
                            <span className={s.keySeparator}>
                              {separators[item.separator ?? 'plus']}
                            </span>
                          )}
                          <kbd>{key}</kbd>
                        </React.Fragment>
                      ))}
                    </div>
                    <span>{item.description}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </Modal>
  );
};
