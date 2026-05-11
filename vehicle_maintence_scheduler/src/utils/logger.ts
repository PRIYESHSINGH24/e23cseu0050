const Log = async (
  stack: string,
  level: string,
  pkg: string,
  message: string
) => {
  console.log(`[${level}] ${pkg}: ${message}`);
};

export default Log;