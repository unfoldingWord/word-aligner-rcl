import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import _ from 'lodash';
import Menu from '../Menu';
import MenuFilter from './MenuFilter';
import MenuHeader from './MenuHeader';

/**
 * Renders filtered menu.
 * This receives the same properties as the {@link Menu} in addition to some filtering options.
 * @param {object[]} filters - an array of filters
 * @param {string} title - the menu title
 *
 */
class FilteredMenu extends React.Component {
  state = {
    filtersOpen: false,
    selectedFilters: [],
  };

  /**
   * Handles opening the filter menu
   */
  handleOpenFilters = () => {
    this.setState(state => ({ filtersOpen: !state.filtersOpen }));
  };

  /**
   * Handles toggling a filter
   * @param {object} filter - the filter being toggled
   */
  handleToggleFilter = filter => {
    const { selectedFilters } = this.state;
    const currentIndex = selectedFilters.findIndex(selected => (selected.id === filter.id));
    const newChecked = [...selectedFilters];

    if (currentIndex === -1) {
      newChecked.push(filter);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({ selectedFilters: newChecked });
    // eslint-disable-next-line no-unused-expressions
    this.props.onFiltersChanged && this.props.onFiltersChanged(newChecked);
  };

  /**
   * Applies default key values to the filters.
   * This prepares filters for use in the filtered menu.
   * @param {[]} filters - an array of filter objects
   * @returns {[]} - an array of normalized filter objects.
   */
  normalizeFilters = memoize(filters => {
    const normalized = [];

    for (let i = 0, len = filters.length; i < len; i++) {
      const filter = Object.assign(
        {},
        {
          value: true, disables: [], id: filters[i].key,
        },
        filters[i],
      );
      normalized.push(filter);
    }
    return normalized;
  });

  /**
   * Executes all of the enabled filters.
   * Filtering is performed by shallow matching against the filter `value`.
   * Filters are evaluated as "or"
   * @property entries - the menu entries
   * @property {string[]} filters - the filteres that will be applied
   * @returns {[]} - the filtered entries
   */
  filter = memoize((entries, filters) => {
    const groups = _.cloneDeep(entries);

    // filter children
    groups.map(group => {
      const _filters = filters.filter(filter => (!filter.nonFilter)); // skip over any entries that are not true filters (such as config options)

      group.children = group.children.filter(entry => {
        for (let i = 0, len = _filters.length; i < len; i++) {
          if (Boolean(entry[_filters[i].key]) === _filters[i].value) {
            return true;
          }
        }
        return _filters.length === 0;
      });
      return group;
    });

    // filter empty groups
    return groups.filter(entry => entry.children.length > 0);
  });

  render() {
    const {
      filters,
      active,
      entries,
      height,
      title,
      onItemClick,
      width,
      statusIcons,
      emptyNotice,
      targetLanguageFont,
    } = this.props;
    const { selectedFilters, filtersOpen } = this.state;
    const normalizedFilters = this.normalizeFilters(filters);
    const filteredEntries = this.filter(entries, selectedFilters);

    // fallback to filter icons
    const menuStatusIcons = statusIcons !== undefined ? statusIcons : filters;

    return (
      <React.Fragment>
        <Menu
          header={
            filters.length ? (
              <MenuFilter
                onToggle={this.handleToggleFilter}
                onOpen={this.handleOpenFilters}
                open={filtersOpen}
                title={title}
                filters={normalizedFilters}
                selected={selectedFilters}
              />
            ) : (
              <MenuHeader title={title} />
            )
          }
          width={width}
          emptyNotice={emptyNotice}
          statusIcons={menuStatusIcons}
          entries={filteredEntries}
          active={active}
          height={height}
          onItemClick={onItemClick}
          targetLanguageFont={targetLanguageFont}
        />
      </React.Fragment>
    );
  }
}

FilteredMenu.propTypes = {
  filters: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  entries: PropTypes.arrayOf(PropTypes.object),
  active: PropTypes.object,
  height: PropTypes.any,
  onItemClick: PropTypes.func,
  width: PropTypes.number,
  emptyNotice: PropTypes.string,
  targetLanguageFont: PropTypes.string,
  statusIcons: PropTypes.arrayOf(PropTypes.object),
  onFiltersChanged: PropTypes.func, // optional callback for filter change events
};

FilteredMenu.defaultProps = { emptyNotice: 'No results found' };

export default React.memo(FilteredMenu);
