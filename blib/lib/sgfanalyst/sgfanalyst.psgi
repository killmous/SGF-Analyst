use strict;
use warnings;

use sgfanalyst;

my $app = sgfanalyst->apply_default_middlewares(sgfanalyst->psgi_app);
$app;

