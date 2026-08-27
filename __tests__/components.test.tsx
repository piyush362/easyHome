import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Provider} from 'react-redux';
import {store} from '../src/store';
import {ThemeProvider} from '../src/theme';
import {
  EHText,
  EHButton,
  EHIconButton,
  EHCard,
  EHAvatar,
  EHListItem,
  EHSection,
  EHModal,
  EHBottomSheet,
  EHSwitch,
} from '../src/components';
import {setTheme, setTextSize} from '../src/store/slices/settingsSlice';

jest.setTimeout(15000);

describe('Design System Components', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('EHText renders across all variants', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHText variant="heading1">Heading 1</EHText>
            <EHText variant="heading2">Heading 2</EHText>
            <EHText variant="body">Body</EHText>
            <EHText variant="caption">Caption</EHText>
            <EHText variant="button">Button</EHText>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('EHButton renders across all variants', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHButton label="Primary" variant="primary" onPress={() => {}} />
            <EHButton label="Secondary" variant="secondary" onPress={() => {}} />
            <EHButton label="Outline" variant="outline" onPress={() => {}} />
            <EHButton label="Ghost" variant="ghost" onPress={() => {}} />
            <EHButton label="Danger" variant="danger" onPress={() => {}} />
            <EHButton label="Loading" loading onPress={() => {}} />
            <EHButton label="Disabled" disabled onPress={() => {}} />
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('EHIconButton, EHCard, and EHAvatar render correctly', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHIconButton
              icon="📞"
              label="Call"
              subtitle="Quick Dial"
              onPress={() => {}}
            />
            <EHCard elevation="medium">
              <EHAvatar name="Alice Daughter" />
            </EHCard>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('EHListItem, EHSection, and EHSwitch render correctly', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHSection title="Section Title" subtitle="Subtitle">
              <EHListItem
                title="Item Title"
                subtitle="Item Subtitle"
                onPress={() => {}}
              />
              <EHSwitch
                label="Toggle Switch"
                description="Switch description"
                value={true}
                onValueChange={() => {}}
              />
            </EHSection>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('EHModal and EHBottomSheet render correctly', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHModal visible={true} onClose={() => {}} title="Modal Title">
              <EHText>Modal Body</EHText>
            </EHModal>
            <EHBottomSheet visible={true} onClose={() => {}} title="Sheet Title">
              <EHText>Sheet Body</EHText>
            </EHBottomSheet>
          </ThemeProvider>
        </Provider>,
      );
    });
    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('Components re-render on Redux theme & size change', async () => {
    let tree: any;
    await ReactTestRenderer.act(async () => {
      tree = ReactTestRenderer.create(
        <Provider store={store}>
          <ThemeProvider>
            <EHText variant="heading1">Themed Text</EHText>
            <EHButton label="Themed Button" onPress={() => {}} />
          </ThemeProvider>
        </Provider>,
      );
    });

    await ReactTestRenderer.act(async () => {
      store.dispatch(setTheme('green'));
      store.dispatch(setTextSize('extraLarge'));
    });

    expect(tree).toBeDefined();
    await ReactTestRenderer.act(async () => {
      tree.unmount();
    });
  });

  test('ELEVATION_TOKENS use modern CSS boxShadow tokens', () => {
    const {ELEVATION_TOKENS} = require('../src/theme/tokens');
    expect(ELEVATION_TOKENS.low.boxShadow).toBeDefined();
    expect(ELEVATION_TOKENS.medium.boxShadow).toBeDefined();
    expect(ELEVATION_TOKENS.high.boxShadow).toBeDefined();
    expect(ELEVATION_TOKENS.low.boxShadow).toContain('rgba');
  });
});
