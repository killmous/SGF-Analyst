package sgfanalyst::View::HTML;
use Moose;
use namespace::autoclean;

extends 'Catalyst::View::TT';

__PACKAGE__->config(
    TEMPLATE_EXTENSION => '.tt',
    render_die => 1,
);

=head1 NAME

sgfanalyst::View::HTML - TT View for sgfanalyst

=head1 DESCRIPTION

TT View for sgfanalyst.

=head1 SEE ALSO

L<sgfanalyst>

=head1 AUTHOR

Wes Caldwell,,,

=head1 LICENSE

This library is free software. You can redistribute it and/or modify
it under the same terms as Perl itself.

=cut

1;
