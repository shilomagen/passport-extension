const path = require('path');

function escapeFileName(str) {
  return `svg-${path.basename(str, '.svg')}`
    .split(/\W+/)
    .map((x) => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
    .join('');
}

const transform = (src, filePath) => {
  if (path.extname(filePath) !== '.svg') {
    return src;
  }

  const name = escapeFileName(filePath);
  return {
    code: `
              const React = require('react');
                function ${name}(props) {
                  return React.createElement(
                    'svg', 
                    Object.assign({}, props, {'data-file-name': ${name}.name})
                  );
                }
                module.exports = ${name};
            `,
  };
};

module.exports = {
  process: transform,
};
